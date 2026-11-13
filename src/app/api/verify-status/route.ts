import { NextRequest, NextResponse } from "next/server";
import { getOrderByZapOrderId } from "@/lib/database";
import { getPackageById } from "@/config/packages";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyZapUPIPayment } from "@/lib/zapupi-payment";

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

    const order = await getOrderByZapOrderId(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const confirmation = await verifyZapUPIPayment(orderId);
    if (!confirmation) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!confirmation.paid) {
      return NextResponse.json(
        {
          paid: false,
          status: confirmation.order.payment_status,
          gatewayStatus: confirmation.gatewayStatus,
          gatewayMessage: confirmation.gatewayMessage,
          message:
            confirmation.gatewayStatus.toLowerCase() === "error"
              ? confirmation.gatewayMessage || "ZapUPI could not find this order"
              : "ZapUPI has not confirmed this payment yet",
        },
        { status: 200 }
      );
    }

    const confirmedOrder = confirmation.order;
    const pkg = getPackageById(confirmedOrder.package_id);

    return NextResponse.json({
      paid: true,
      orderId: confirmedOrder.zap_order_id,
      paymentId: confirmedOrder.zap_txn_id,
      amount: confirmedOrder.amount,
      packageName: pkg ? pkg.name : confirmedOrder.package_id.toUpperCase(),
      deliveryEstimate: pkg?.deliveryEstimate || "2 - 4 Hours",
      customerName: confirmedOrder.customer_details.fullName,
      whatsappNumber: confirmedOrder.customer_details.whatsappNumber,
      createdAt: confirmedOrder.created_at,
    });
  } catch (error) {
    console.error("API /api/verify-status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
