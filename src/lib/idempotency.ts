import { getOrderByRazorpayOrderId, saveOrder } from "./database";
import { prisma, isPrismaConfigured } from "./prisma";

// In-memory set of handled payment IDs to prevent duplicate calls in local dev
const processedPayments = new Set<string>();

/**
 * Atomically checks if a payment has already had its notification dispatched.
 * Using Prisma on MongoDB: performs atomic updateMany with condition { notification_status: { not: "SENT" } }
 * Guarantees that only ONE notification is sent per payment across serverless instances and concurrent webhook/checkout verification.
 * Returns true if lock was acquired (caller MUST send notification).
 * Returns false if already processed.
 */
export async function claimPaymentNotificationLock(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<boolean> {
  // Quick in-memory deduplication check
  if (processedPayments.has(razorpayPaymentId)) {
    return false;
  }

  // If Prisma MongoDB is configured, perform atomic condition update
  if (isPrismaConfigured()) {
    try {
      const updateResult = await prisma.order.updateMany({
        where: {
          razorpay_order_id: razorpayOrderId,
          notification_status: { not: "SENT" },
        },
        data: {
          razorpay_payment_id: razorpayPaymentId,
          notification_status: "SENT",
          payment_status: "PAID",
          updated_at: new Date(),
        },
      });

      if (updateResult.count > 0) {
        processedPayments.add(razorpayPaymentId);
        return true;
      } else {
        // Count is 0 -> either order does not exist or notification_status is already SENT
        processedPayments.add(razorpayPaymentId);
        return false;
      }
    } catch (err) {
      console.error("Prisma atomic lock error:", err);
    }
  }

  // Fallback to local storage locking
  const order = await getOrderByRazorpayOrderId(razorpayOrderId);
  if (!order) {
    return false;
  }

  if (order.notification_status === "SENT") {
    processedPayments.add(razorpayPaymentId);
    return false;
  }

  processedPayments.add(razorpayPaymentId);
  order.razorpay_payment_id = razorpayPaymentId;
  order.notification_status = "SENT";
  order.payment_status = "PAID";
  order.updated_at = new Date().toISOString();

  await saveOrder(order);
  return true;
}
