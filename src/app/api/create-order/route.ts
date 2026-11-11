import { NextRequest, NextResponse } from "next/server";
import { orderFormSchema } from "@/lib/validation";
import { getPackageById } from "@/config/packages";
import { razorpayInstance } from "@/lib/razorpay";
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
    const amountInPaise = amountInINR * 100;
    const receiptId = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // 4. Create Razorpay Order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        fullName: data.fullName,
        gameId: data.gameId,
        whatsappNumber: data.whatsappNumber,
        deviceModel: data.deviceModel,
        packageId: data.packageId,
        packageName: selectedPackage.name,
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { error: "Failed to initiate payment gateway order" },
        { status: 500 }
      );
    }

    // 5. Save order in storage
    const newOrder: OrderRecord = {
      id: razorpayOrder.id,
      razorpay_order_id: razorpayOrder.id,
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

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInINR,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      packageName: selectedPackage.name,
    });
  } catch (error: any) {
    console.error("API /api/create-order error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred while creating order" },
      { status: 500 }
    );
  }
}
