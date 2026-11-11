import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSchema } from "@/lib/validation";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getOrderByRazorpayOrderId } from "@/lib/database";
import { claimPaymentNotificationLock } from "@/lib/idempotency";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const clientIp = getClientIp(req);
    const rl = await rateLimit(`verify_payment_${clientIp}`, 20, 60000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Validate input
    const body = await req.json();
    const parseResult = verifyPaymentSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payment verification payload" },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parseResult.data;

    // 3. Cryptographic Signature Verification (HMAC SHA256 timing-safe)
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // 4. Fetch stored order record
    const order = await getOrderByRazorpayOrderId(razorpay_order_id);
    if (!order) {
      return NextResponse.json(
        { error: "Order record not found for this transaction" },
        { status: 404 }
      );
    }

    // 5. Idempotent Notification & Order Status Update
    const acquiredLock = await claimPaymentNotificationLock(razorpay_order_id, razorpay_payment_id);

    if (acquiredLock) {
      // Refresh order with payment ID
      order.razorpay_payment_id = razorpay_payment_id;
      order.payment_status = "PAID";

      // Dispatch Telegram notification asynchronously
      sendTelegramOrderNotification(order).catch((err) => {
        console.error("Failed to send background Telegram notification:", err);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      packageId: order.package_id,
      amount: order.amount,
      customerName: order.customer_details.fullName,
    });
  } catch (error: any) {
    console.error("API /api/verify-payment error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
