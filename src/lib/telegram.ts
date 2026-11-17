import { OrderRecord } from "@/types/order";
import { getIndianTime, formatINR } from "./utils";
import { escapeTelegramHtml } from "./sanitize";
import { getPackageById } from "@/config/packages";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeTelegramValue(value: unknown, fallback = "Not specified"): string {
  const text = typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim() : "";
  return escapeTelegramHtml((text || fallback).slice(0, 500));
}

export async function sendTelegramOrderNotification(order: OrderRecord): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot token or chat ID is not configured. Notification skipped.");
    return false;
  }

  const istTime = getIndianTime(new Date());
  const packageDetails = getPackageById(order.package_id);

  const message = [
    "🔥 <b>NEW PAID ORDER</b>",
    "━━━━━━━━━━━━━━━━━━",
    "",
    "🧾 <b>ORDER DETAILS</b>",
    `<b>Order ID:</b> <code>${escapeTelegramValue(order.zap_order_id)}</code>`,
    `<b>Payment ID:</b> <code>${escapeTelegramValue(order.zap_txn_id, "N/A")}</code>`,
    `<b>Amount paid:</b> ${formatINR(order.amount)}`,
    `<b>Package:</b> ${escapeTelegramValue(packageDetails?.name ?? order.package_id)}`,
    "",
    "👤 <b>PLAYER DETAILS</b>",
    `<b>Name:</b> ${escapeTelegramValue(order.customer_details.fullName)}`,
    `<b>Free Fire ID:</b> <code>${escapeTelegramValue(order.customer_details.gameId)}</code>`,
    `<b>WhatsApp:</b> ${escapeTelegramValue(order.customer_details.whatsappNumber)}`,
    `<b>Telegram:</b> ${escapeTelegramValue(order.customer_details.telegramUsername, "None")}`,
    "",
    "📱 <b>DEVICE &amp; SETTINGS</b>",
    `<b>Phone:</b> ${escapeTelegramValue(order.device_details.deviceModel)}`,
    `<b>RAM:</b> ${escapeTelegramValue(order.device_details.ram)}`,
    `<b>Chipset:</b> ${escapeTelegramValue(order.device_details.chipset)}`,
    `<b>Refresh rate:</b> ${escapeTelegramValue(order.device_details.refreshRate)}`,
    `<b>DPI:</b> ${escapeTelegramValue(order.device_details.deviceDpi, "Default")}`,
    `<b>Sensitivity:</b> ${escapeTelegramValue(order.device_details.sensiPreference)}`,
    `<b>Play style:</b> ${escapeTelegramValue(order.device_details.playStyle)}`,
    `<b>Finger layout:</b> ${escapeTelegramValue(order.device_details.fingerLayout)}`,
    "",
    `🕒 <b>Received:</b> ${escapeTelegramValue(istTime)} IST`,
  ].join("\n");

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Telegram API error response:", errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}
