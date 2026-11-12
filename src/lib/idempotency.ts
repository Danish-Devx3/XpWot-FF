import { getOrderByZapOrderId, saveOrder } from "./database";
import { getOrdersCollection } from "./mongodb";

// In-memory set of handled ZapUPI transaction IDs for local development.
const processedTransactions = new Set<string>();

/**
 * Atomically checks if a payment has already had its notification dispatched.
 * MongoDB uses one atomic update on the matching order.
 * Prevents duplicate notifications across serverless instances and concurrent webhook/status checks.
 * Returns true if lock was acquired (caller MUST send notification).
 * Returns false if already processed.
 */
export async function claimPaymentNotificationLock(
  zapOrderId: string,
  zapTransactionId: string
): Promise<boolean> {
  // Quick in-memory deduplication check
  if (processedTransactions.has(zapTransactionId)) {
    return false;
  }

  const collection = await getOrdersCollection();
  if (collection) {
    const result = await collection.updateOne(
      { zap_order_id: zapOrderId, notification_status: { $ne: "SENT" } },
      {
        $set: {
          zap_txn_id: zapTransactionId,
          notification_status: "SENT",
          payment_status: "PAID",
          updated_at: new Date(),
        },
      }
    );
    processedTransactions.add(zapTransactionId);
    return result.modifiedCount === 1;
  }

  // Fallback to local storage locking
  const order = await getOrderByZapOrderId(zapOrderId);
  if (!order) {
    return false;
  }

  if (order.notification_status === "SENT") {
    processedTransactions.add(zapTransactionId);
    return false;
  }

  processedTransactions.add(zapTransactionId);
  order.zap_txn_id = zapTransactionId;
  order.notification_status = "SENT";
  order.payment_status = "PAID";
  order.updated_at = new Date().toISOString();

  await saveOrder(order);
  return true;
}

export async function releasePaymentNotificationLock(
  zapOrderId: string,
  zapTransactionId: string
): Promise<void> {
  const collection = await getOrdersCollection();
  if (collection) {
    const now = new Date();
    const result = await collection.updateOne(
      {
        zap_order_id: zapOrderId,
        zap_txn_id: zapTransactionId,
        notification_status: "SENT",
      },
      { $set: { notification_status: "FAILED", updated_at: now } }
    );
    processedTransactions.delete(zapTransactionId);
    if (result.modifiedCount === 1) {
      await getOrderByZapOrderId(zapOrderId);
    }
    return;
  }

  const order = await getOrderByZapOrderId(zapOrderId);
  if (
    order?.zap_txn_id === zapTransactionId &&
    order.notification_status === "SENT"
  ) {
    order.notification_status = "FAILED";
    order.updated_at = new Date().toISOString();
    await saveOrder(order);
  }
  processedTransactions.delete(zapTransactionId);
}
