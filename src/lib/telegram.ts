import { OrderRecord } from "@/types/order";
import { getIndianTime } from "./utils";
import { sanitizeText } from "./sanitize";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramOrderNotification(order: OrderRecord): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot token or chat ID is not configured. Notification skipped.");
    return false;
  }

  const istTime = getIndianTime(new Date());

  const message = [
    "🔥 NEW PAID ORDER RECEIVED 🔥",
    "",
    `Order ID: ${sanitizeText(order.razorpay_order_id)}`,
    `Payment ID: ${sanitizeText(order.razorpay_payment_id || "N/A")}`,
    `Amount: ₹${order.amount}`,
    `Pack: ${order.package_id.toUpperCase()} PACK`,
    "",
    "👤 PLAYER DETAILS:",
    `Name: ${sanitizeText(order.customer_details.fullName)}`,
    `Free Fire ID: ${sanitizeText(order.customer_details.gameId)}`,
    `WhatsApp: ${sanitizeText(order.customer_details.whatsappNumber)}`,
    `Telegram: ${order.customer_details.telegramUsername ? sanitizeText(order.customer_details.telegramUsername) : "None"}`,
    "",
    "📱 DEVICE & SETTINGS:",
    `Phone: ${sanitizeText(order.device_details.deviceModel)}`,
    `RAM: ${order.device_details.ram}`,
    `Chipset: ${order.device_details.chipset ? sanitizeText(order.device_details.chipset) : "Not specified"}`,
    `Refresh Rate: ${order.device_details.refreshRate}`,
    `DPI: ${order.device_details.deviceDpi ? sanitizeText(order.device_details.deviceDpi) : "Default"}`,
    `Sensi Speed: ${order.device_details.sensiPreference}`,
    `Play Style: ${order.device_details.playStyle}`,
    `Finger Layout: ${order.device_details.fingerLayout}`,
    "",
    `⏰ Time: ${istTime} (IST)`,
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

