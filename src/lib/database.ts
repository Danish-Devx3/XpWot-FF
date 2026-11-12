import fs from "fs";
import path from "path";
import { Document, ObjectId } from "mongodb";
import { OrderRecord, PaymentStatus, NotificationStatus } from "@/types/order";
import { getOrdersCollection } from "./mongodb";

// In-memory cache + file-backed persistence fallback for instant local dev
const localStore = new Map<string, OrderRecord>();
const archivedLocalOrders: unknown[] = [];
const LOCAL_DB_PATH = path.join(process.cwd(), ".data", "orders.json");

function ensureDataDir() {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: unknown[] = JSON.parse(data);
      list.forEach((order) => {
        if (
          order !== null &&
          typeof order === "object" &&
          "zap_order_id" in order &&
          typeof order.zap_order_id === "string"
        ) {
          localStore.set(order.zap_order_id, order as OrderRecord);
        } else {
          archivedLocalOrders.push(order);
        }
      });
    }
  } catch (err) {
    console.error("Local order persistence init error:", err);
  }
}

function persistLocalOrders() {
  try {
    const list = [...archivedLocalOrders, ...Array.from(localStore.values())];
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local orders:", err);
  }
}

ensureDataDir();

function toOrderRecord(doc: Document): OrderRecord {
  const createdAt = doc.created_at instanceof Date ? doc.created_at : new Date(doc.created_at);
  const updatedAt = doc.updated_at instanceof Date ? doc.updated_at : new Date(doc.updated_at);

  return {
    id: doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id),
    zap_order_id: String(doc.zap_order_id),
    zap_gateway_order_id:
      typeof doc.zap_gateway_order_id === "string" ? doc.zap_gateway_order_id : undefined,
    zap_txn_id: typeof doc.zap_txn_id === "string" ? doc.zap_txn_id : undefined,
    zap_utr: typeof doc.zap_utr === "string" ? doc.zap_utr : undefined,
    customer_details: doc.customer_details as OrderRecord["customer_details"],
    device_details: doc.device_details as OrderRecord["device_details"],
    package_id: doc.package_id as OrderRecord["package_id"],
    amount: Number(doc.amount),
    payment_status: doc.payment_status as PaymentStatus,
    notification_status: doc.notification_status as NotificationStatus,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };
}

/**
 * Saves or updates an order in MongoDB using single-document writes.
 */
export async function saveOrder(order: OrderRecord): Promise<void> {
  const collection = await getOrdersCollection();
  if (collection) {
    const now = new Date(order.updated_at);
    await collection.updateOne(
      { zap_order_id: order.zap_order_id },
      {
        $set: {
          zap_txn_id: order.zap_txn_id,
          zap_utr: order.zap_utr,
          zap_gateway_order_id: order.zap_gateway_order_id,
          customer_details: order.customer_details,
          device_details: order.device_details,
          package_id: order.package_id,
          amount: order.amount,
          payment_status: order.payment_status,
          notification_status: order.notification_status,
          updated_at: now,
        },
        $setOnInsert: {
          _id: new ObjectId(),
          zap_order_id: order.zap_order_id,
          created_at: new Date(order.created_at),
        },
      },
      { upsert: true }
    );
  }

  localStore.set(order.zap_order_id, order);
  persistLocalOrders();
}

/**
 * Retrieves an order by its ZapUPI order ID from MongoDB or local cache
 */
export async function getOrderByZapOrderId(orderId: string): Promise<OrderRecord | null> {
  const collection = await getOrdersCollection();
  if (collection) {
    const doc = await collection.findOne({
      $or: [{ zap_order_id: orderId }, { zap_gateway_order_id: orderId }],
    });
    if (doc) {
      const order = toOrderRecord(doc);
      localStore.set(orderId, order);
      return order;
    }
  }

  return (
    localStore.get(orderId) ||
    Array.from(localStore.values()).find((order) => order.zap_gateway_order_id === orderId) ||
    null
  );
}

/**
 * Retrieves an order by its ZapUPI transaction ID from MongoDB or local cache
 */
export async function getOrderByZapTransactionId(transactionId: string): Promise<OrderRecord | null> {
  const collection = await getOrdersCollection();
  if (collection) {
    const doc = await collection.findOne({ zap_txn_id: transactionId });
    if (doc) {
      return toOrderRecord(doc);
    }
  }

  for (const order of Array.from(localStore.values())) {
    if (order.zap_txn_id === transactionId) {
      return order;
    }
  }

  return null;
}

/**
 * Updates an order's payment & notification status
 */
export async function updateOrderStatus(
  orderId: string,
  transactionId: string,
  paymentStatus: PaymentStatus,
  notificationStatus?: NotificationStatus,
  utr?: string
): Promise<OrderRecord | null> {
  const order = await getOrderByZapOrderId(orderId);
  if (!order) return null;

  if (transactionId) {
    order.zap_txn_id = transactionId;
  }
  if (utr) {
    order.zap_utr = utr;
  }
  order.payment_status = paymentStatus;
  if (notificationStatus) {
    order.notification_status = notificationStatus;
  }
  order.updated_at = new Date().toISOString();

  await saveOrder(order);
  return order;
}
