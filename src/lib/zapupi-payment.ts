import { getOrderByZapOrderId, saveOrder, updateOrderStatus } from "./database";
import {
  claimPaymentNotificationLock,
  releasePaymentNotificationLock,
} from "./idempotency";
import { getZapUPIOrderStatus } from "./zapupi";
import { sendTelegramOrderNotification } from "./telegram";
import { OrderRecord } from "@/types/order";

export interface ZapUPIPaymentConfirmation {
  paid: boolean;
  order: OrderRecord;
  gatewayStatus: string;
  gatewayMessage?: string;
}

async function notifyPaidOrder(order: OrderRecord): Promise<void> {
  if (!order.zap_txn_id || order.notification_status === "SENT") {
    return;
  }

  const shouldNotify = await claimPaymentNotificationLock(
    order.zap_order_id,
    order.zap_txn_id
  );
  if (!shouldNotify) {
    return;
  }

  const notificationSent = await sendTelegramOrderNotification(order);
  if (!notificationSent) {
    await releasePaymentNotificationLock(order.zap_order_id, order.zap_txn_id);
  }
}

export async function verifyZapUPIPayment(
  orderId: string
): Promise<ZapUPIPaymentConfirmation | null> {
  const order = await getOrderByZapOrderId(orderId);
  if (!order) {
    return null;
  }

  if (order.payment_status === "PAID" || order.payment_status === "VERIFIED") {
    await notifyPaidOrder(order);
    return { paid: true, order, gatewayStatus: "Success" };
  }

  const payment = await getZapUPIOrderStatus(order.zap_gateway_order_id || order.zap_order_id);
  const status = payment.status.toLowerCase();

  if (status === "error") {
    return {
      paid: false,
      order,
      gatewayStatus: payment.status,
      gatewayMessage: payment.message || payment.error,
    };
  }

  if (status === "failed") {
    order.payment_status = "FAILED";
    order.updated_at = new Date().toISOString();
    await saveOrder(order);
    return { paid: false, order, gatewayStatus: payment.status, gatewayMessage: payment.message };
  }

  if (status !== "success") {
    return { paid: false, order, gatewayStatus: payment.status, gatewayMessage: payment.message };
  }

  const isTestPayment =
    payment.environment?.toLowerCase() === "test" ||
    payment.txn_id?.toUpperCase().startsWith("DUMMY") === true;
  if (process.env.NODE_ENV === "production" && isTestPayment) {
    return {
      paid: false,
      order,
      gatewayStatus: payment.status,
      gatewayMessage: "ZapUPI test payments cannot be accepted in production.",
    };
  }

  const paidAmount = Number(payment.amount ?? payment.pay_amount);
  if (!Number.isFinite(paidAmount) || Math.round(paidAmount * 100) !== Math.round(order.amount * 100)) {
    throw new Error(`ZapUPI returned an unexpected amount for order ${orderId}`);
  }

  if (!payment.txn_id) {
    throw new Error(`ZapUPI did not return a transaction ID for order ${orderId}`);
  }

  const updatedOrder = await updateOrderStatus(
    order.zap_order_id,
    payment.txn_id,
    "PAID",
    undefined,
    payment.utr
  );
  const confirmedOrder = updatedOrder || order;
  await notifyPaidOrder(confirmedOrder);

  return { paid: true, order: confirmedOrder, gatewayStatus: payment.status };
}
