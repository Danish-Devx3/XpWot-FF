/**
 * ZapUPI Payment Gateway Integration
 * Docs: https://zapupi.com/docs
 *
 * Payment status is confirmed server-side through the order-status API.
 */

const ZAP_API_BASE = "https://pay.zapupi.com/api";
function getZapKey(): string {
  const key = process.env.ZAPUPI_KEY;
  if (!key) {
    throw new Error("ZAPUPI_KEY is not configured");
  }
  return key;
}

export interface ZapUPICreateOrderPayload {
  zap_key: string;
  order_id: string;
  amount: string; // INR as string
  customer_mobile?: string;
  remark?: string;
  webhook_url: string;
  success_url: string;
  failed_url: string;
  timeout_url: string;
}

export interface ZapUPICreateOrderResponse {
  status: boolean | string;
  order_id?: string;
  payment_url?: string;
  message?: string;
  error?: string;
}

export interface ZapUPIOrderStatusResponse {
  status: string; // "Success" | "Failed" | "Pending" or an API error
  amount?: string | number;
  pay_amount?: string | number;
  txn_id?: string;
  utr?: string;
  environment?: string;
  message?: string;
  error?: string;
}

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

async function postZapUPI(
  endpoint: string,
  payload: object
): Promise<JsonObject> {
  const res = await fetch(`${ZAP_API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`ZapUPI ${endpoint} request failed (HTTP ${res.status})`);
  }

  const response: unknown = await res.json();
  if (!isJsonObject(response)) {
    throw new Error(`ZapUPI ${endpoint} returned an invalid response`);
  }

  return isJsonObject(response.data)
    ? { ...response, ...response.data }
    : response;
}

/**
 * Creates a ZapUPI payment order and returns the payment_url to redirect to.
 */
export async function createZapUPIOrder(
  orderId: string,
  amountINR: number,
  customerMobile?: string,
  remark?: string
): Promise<ZapUPICreateOrderResponse> {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xpwot.com";
  let siteUrl: URL;
  try {
    siteUrl = new URL(configuredSiteUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL");
  }

  if (
    process.env.NODE_ENV === "production" &&
    (siteUrl.protocol !== "https:" ||
      siteUrl.hostname === "localhost" ||
      siteUrl.hostname === "127.0.0.1" ||
      siteUrl.hostname === "::1")
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a public HTTPS URL in production");
  }

  const siteOrigin = siteUrl.origin;

  const payload: ZapUPICreateOrderPayload = {
    zap_key: getZapKey(),
    order_id: orderId,
    amount: amountINR.toString(),
    webhook_url: `${siteOrigin}/api/zapupi-webhook`,
    success_url: `${siteOrigin}/success`,
    failed_url: `${siteOrigin}/order?payment=failed`,
    timeout_url: `${siteOrigin}/order?payment=timeout`,
  };

  if (customerMobile) payload.customer_mobile = customerMobile;
  if (remark) payload.remark = remark;

  const response = await postZapUPI("create-order", payload);
  if (typeof response.status !== "string" && typeof response.status !== "boolean") {
    throw new Error("ZapUPI create-order response is missing its status");
  }

  return {
    status: response.status,
    order_id: optionalString(response.order_id),
    payment_url: optionalString(response.payment_url),
    message: optionalString(response.message),
    error: optionalString(response.error),
  };
}

/**
 * Verifies a ZapUPI payment by calling the order-status API.
 * Returns the full status response.
 */
export async function getZapUPIOrderStatus(
  orderId: string
): Promise<ZapUPIOrderStatusResponse> {
  const response = await postZapUPI("order-status", {
    zap_key: getZapKey(),
    order_id: orderId,
  });

  if (typeof response.status !== "string") {
    throw new Error("ZapUPI order-status response is missing its status");
  }

  return {
    status: response.status,
    amount:
      typeof response.amount === "string" || typeof response.amount === "number"
        ? response.amount
        : undefined,
    pay_amount:
      typeof response.pay_amount === "string" || typeof response.pay_amount === "number"
        ? response.pay_amount
        : undefined,
    txn_id: optionalString(response.txn_id),
    utr: optionalString(response.utr),
    environment: optionalString(response.environment),
    message: optionalString(response.message),
    error: optionalString(response.error),
  };
}
