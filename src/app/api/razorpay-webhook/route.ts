import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getOrderByRazorpayOrderId } from "@/lib/database";
import { claimPaymentNotificationLock } from "@/lib/idempotency";
import { sendTelegramOrderNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // 1. Verify Webhook signature using dedicated RAZORPAY_WEBHOOK_SECRET
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature detected");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 2. Parse event payload
    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ status: "ignored" }, { status: 200 });
      }

      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return NextResponse.json({ status: "ignored" }, { status: 200 });
      }

      // 3. Check if stored order exists
      const order = await getOrderByRazorpayOrderId(razorpayOrderId);
      if (!order) {
        console.warn(`Webhook received for unknown order: ${razorpayOrderId}`);
        return NextResponse.json({ status: "order_not_found" }, { status: 200 });
      }

      // 4. Idempotent lock check
      const acquiredLock = await claimPaymentNotificationLock(razorpayOrderId, razorpayPaymentId);
      if (acquiredLock) {
        order.razorpay_payment_id = razorpayPaymentId;
        order.payment_status = "PAID";

        await sendTelegramOrderNotification(order);
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
