import fs from "fs";
import path from "path";
import { OrderRecord, PaymentStatus, NotificationStatus } from "@/types/order";
import { prisma, isPrismaConfigured } from "./prisma";

// In-memory cache + file-backed persistence fallback for instant local dev
const localStore = new Map<string, OrderRecord>();
const LOCAL_DB_PATH = path.join(process.cwd(), ".data", "orders.json");

function ensureDataDir() {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: OrderRecord[] = JSON.parse(data);
      list.forEach((order) => localStore.set(order.razorpay_order_id, order));
    }
  } catch (err) {
    console.error("Local order persistence init error:", err);
  }
}

function persistLocalOrders() {
  try {
    const list = Array.from(localStore.values());
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local orders:", err);
  }
}

ensureDataDir();

/**
 * Saves or updates an order in MongoDB via Prisma (with local fallback)
 */
export async function saveOrder(order: OrderRecord): Promise<void> {
  // Always update local memory cache
  localStore.set(order.razorpay_order_id, order);
  persistLocalOrders();

  // If Prisma MongoDB is configured, perform an upsert
  if (isPrismaConfigured()) {
    try {
      await prisma.order.upsert({
        where: { razorpay_order_id: order.razorpay_order_id },
        update: {
          razorpay_payment_id: order.razorpay_payment_id,
          payment_status: order.payment_status,
          notification_status: order.notification_status,
          amount: order.amount,
        },
        create: {
          razorpay_order_id: order.razorpay_order_id,
          razorpay_payment_id: order.razorpay_payment_id,
          customer_details: order.customer_details as any,
          device_details: order.device_details as any,
          package_id: order.package_id,
          amount: order.amount,
          payment_status: order.payment_status,
          notification_status: order.notification_status,
        },
      });
    } catch (err) {
      console.error("Prisma MongoDB order save error:", err);
    }
  }
}

/**
 * Retrieves an order by its Razorpay Order ID from MongoDB via Prisma or local cache
 */
export async function getOrderByRazorpayOrderId(orderId: string): Promise<OrderRecord | null> {
  // Try Prisma MongoDB
  if (isPrismaConfigured()) {
    try {
      const doc = await prisma.order.findUnique({
        where: { razorpay_order_id: orderId },
      });
      if (doc) {
        const orderData: OrderRecord = {
          id: doc.id,
          razorpay_order_id: doc.razorpay_order_id,
          razorpay_payment_id: doc.razorpay_payment_id || undefined,
          customer_details: doc.customer_details as any,
          device_details: doc.device_details as any,
          package_id: doc.package_id as any,
          amount: doc.amount,
          payment_status: doc.payment_status as PaymentStatus,
          notification_status: doc.notification_status as NotificationStatus,
          created_at: doc.created_at.toISOString(),
          updated_at: doc.updated_at.toISOString(),
        };
        localStore.set(orderId, orderData);
        return orderData;
      }
    } catch (err) {
      console.error("Prisma MongoDB fetch order error:", err);
    }
  }

  // Fallback to local cache
  return localStore.get(orderId) || null;
}

/**
 * Retrieves an order by its Razorpay Payment ID from MongoDB via Prisma or local cache
 */
export async function getOrderByRazorpayPaymentId(paymentId: string): Promise<OrderRecord | null> {
  // Try Prisma MongoDB
  if (isPrismaConfigured()) {
    try {
      const doc = await prisma.order.findFirst({
        where: { razorpay_payment_id: paymentId },
      });
      if (doc) {
        return {
          id: doc.id,
          razorpay_order_id: doc.razorpay_order_id,
          razorpay_payment_id: doc.razorpay_payment_id || undefined,
          customer_details: doc.customer_details as any,
          device_details: doc.device_details as any,
          package_id: doc.package_id as any,
          amount: doc.amount,
          payment_status: doc.payment_status as PaymentStatus,
          notification_status: doc.notification_status as NotificationStatus,
          created_at: doc.created_at.toISOString(),
          updated_at: doc.updated_at.toISOString(),
        };
      }
    } catch (err) {
      console.error("Prisma MongoDB fetch order by payment error:", err);
    }
  }

  // Fallback to local
  for (const order of Array.from(localStore.values())) {
    if (order.razorpay_payment_id === paymentId) {
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
  paymentId: string,
  paymentStatus: PaymentStatus,
  notificationStatus?: NotificationStatus
): Promise<OrderRecord | null> {
  const order = await getOrderByRazorpayOrderId(orderId);
  if (!order) return null;

  order.razorpay_payment_id = paymentId;
  order.payment_status = paymentStatus;
  if (notificationStatus) {
    order.notification_status = notificationStatus;
  }
  order.updated_at = new Date().toISOString();

  await saveOrder(order);
  return order;
}
