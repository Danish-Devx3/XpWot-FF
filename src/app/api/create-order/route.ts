import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { orderFormSchema } from "@/lib/validation";
import { getPackageById } from "@/config/packages";
import { createZapUPIOrder } from "@/lib/zapupi";
import { saveOrder } from "@/lib/database";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { OrderRecord } from "@/types/order";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (max 15 requests per minute per IP)
    const clientIp = getClientIp(req);
    const rl = await rateLimit(`create_order_${clientIp}`, 15, 60000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        { status: 429 }
      );
    }

    // 2. Validate input with Zod
    const body = await req.json();
    const parseResult = orderFormSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    // 3. Server-side Package Price Validation (Never trust client prices)
    const selectedPackage = getPackageById(data.packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
    }

    const amountInINR = selectedPackage.price;
    const orderId = `xpwot_${randomUUID().replace(/-/g, "")}`;
    const newOrder: OrderRecord = {
      id: orderId,
      zap_order_id: orderId,
      customer_details: {
        fullName: data.fullName,
        gameId: data.gameId,
        whatsappNumber: data.whatsappNumber,
        telegramUsername: data.telegramUsername,
      },
      device_details: {
        deviceModel: data.deviceModel,
        ram: data.ram,
        chipset: data.chipset,
        refreshRate: data.refreshRate,
        deviceDpi: data.deviceDpi,
        sensiPreference: data.sensiPreference,
        playStyle: data.playStyle,
        fingerLayout: data.fingerLayout,
      },
      package_id: data.packageId,
      amount: amountInINR,
      payment_status: "CREATED",
      notification_status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveOrder(newOrder);

    const zapOrder = await createZapUPIOrder(
      orderId,
      amountInINR,
      data.whatsappNumber,
      `${selectedPackage.name} | ${data.gameId}`
    );
    const successfulResponse =
      zapOrder.status === true ||
      (typeof zapOrder.status === "string" &&
        ["success", "true"].includes(zapOrder.status.toLowerCase()));

    if (!successfulResponse || !zapOrder.payment_url || !zapOrder.order_id) {
      const gatewayReason = zapOrder.error || zapOrder.message;
      const apiKey = process.env.ZAPUPI_KEY;
      const safeGatewayReason = gatewayReason?.slice(0, 300);
      console.warn("ZapUPI rejected create-order request", {
        orderId,
        status: zapOrder.status,
        reason:
          safeGatewayReason && apiKey
            ? safeGatewayReason.split(apiKey).join("[redacted]")
            : safeGatewayReason,
        hasPaymentUrl: Boolean(zapOrder.payment_url),
        hasGatewayOrderId: Boolean(zapOrder.order_id),
      });

      newOrder.payment_status = "FAILED";
      newOrder.updated_at = new Date().toISOString();
      await saveOrder(newOrder);
      const insufficientBalance =
        gatewayReason?.toLowerCase().includes("insufficient topup balance") ?? false;
      return NextResponse.json(
        {
          error: insufficientBalance
            ? "ZapUPI cannot create the payment because the merchant account has insufficient top-up balance. Add funds to your ZapUPI account or contact ZapUPI support, then try again."
            : "ZapUPI rejected the payment request. Check the server logs for the gateway reason.",
        },
        { status: 502 }
      );
    }

    newOrder.zap_gateway_order_id = zapOrder.order_id;
    newOrder.updated_at = new Date().toISOString();
    await saveOrder(newOrder);

    let paymentUrl: URL;
    try {
      paymentUrl = new URL(zapOrder.payment_url);
    } catch {
      throw new Error("ZapUPI returned an invalid payment URL");
    }

    if (paymentUrl.protocol !== "https:") {
      throw new Error("ZapUPI returned an insecure payment URL");
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInINR,
      currency: "INR",
      paymentUrl: paymentUrl.toString(),
      packageName: selectedPackage.name,
    });
  } catch (error) {
    console.error("API /api/create-order error:", error);
    return NextResponse.json(
      { error: "Unable to create your order right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
