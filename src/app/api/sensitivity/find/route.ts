import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  calculateSensitivity,
  sensitivityRequestSchema,
} from "@/lib/sensitivity-calculator";

export async function POST(request: Request) {
  const limit = await rateLimit(`sensitivity:${getClientIp(request)}`, 20, 5 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many sensitivity requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = sensitivityRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sensitivity request.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json(calculateSensitivity(parsed.data));
}
