import { NextRequest, NextResponse } from "next/server";
import { zapupiWebhookSchema } from "@/lib/validation";
import { verifyZapUPIPayment } from "@/lib/zapupi-payment";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "zapupi-webhook" });
}

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch (error) {
    console.warn("ZapUPI webhook received invalid JSON:", error);
    return NextResponse.json({ status: "ok" });
  }

  const parsed = zapupiWebhookSchema.safeParse(payload);
  if (!parsed.success) {
    console.warn("ZapUPI webhook received an invalid payload");
    return NextResponse.json({ status: "ok" });
  }

  console.info("ZapUPI webhook received", {
    orderId: parsed.data.order_id,
    status: parsed.data.status,
    environment: parsed.data.environment || "unspecified",
  });

  if (
    process.env.NODE_ENV === "production" &&
    (parsed.data.environment?.toLowerCase() === "test" ||
      parsed.data.txn_id?.toUpperCase().startsWith("DUMMY") === true)
  ) {
    console.warn(`Ignoring ZapUPI test webhook for order: ${parsed.data.order_id}`);
    return NextResponse.json({ status: "ok" });
  }

  try {
    const confirmation = await verifyZapUPIPayment(parsed.data.order_id);
    if (!confirmation) {
      console.warn(`ZapUPI webhook received for unknown order: ${parsed.data.order_id}`);
    } else {
      console.info("ZapUPI webhook verification completed", {
        orderId: parsed.data.order_id,
        paid: confirmation.paid,
        gatewayStatus: confirmation.gatewayStatus,
      });
    }
  } catch (error) {
    console.error("ZapUPI webhook payment confirmation failed:", error);
  }

  return NextResponse.json({ status: "ok" });
}
