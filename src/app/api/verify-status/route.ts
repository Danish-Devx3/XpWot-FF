import { NextRequest, NextResponse } from "next/server";
import { getOrderByRazorpayOrderId } from "@/lib/database";
import { getPackageById } from "@/config/packages";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = await rateLimit(`verify_status_${clientIp}`, 30, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID parameter is required" },
        { status: 400 }
      );
    }

    const order = await getOrderByRazorpayOrderId(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Only return success if status is PAID or VERIFIED
    if (order.payment_status !== "PAID" && order.payment_status !== "VERIFIED") {
      return NextResponse.json(
        {
          paid: false,
          status: order.payment_status,
          message: "Payment has not yet been verified for this order",
        },
        { status: 200 }
      );
    }

    const pkg = getPackageById(order.package_id);

    return NextResponse.json({
      paid: true,
      orderId: order.razorpay_order_id,
      paymentId: order.razorpay_payment_id,
      amount: order.amount,
      packageName: pkg ? pkg.name : order.package_id.toUpperCase(),
      deliveryEstimate: pkg?.deliveryEstimate || "4 - 8 Hours",
      customerName: order.customer_details.fullName,
      whatsappNumber: order.customer_details.whatsappNumber,
      createdAt: order.created_at,
    });
  } catch (error: any) {
    console.error("API /api/verify-status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
