// Standalone Telegram ping — no dotenv needed
const TOKEN = "9109130172:AAHe_9Mh_zve2b9t3k9hz8RHhG2Ti01m78A";
const CHAT_ID = "5409040124";

const msg = [
  "🔥 XPWOT TELEGRAM BOT CONNECTED SUCCESSFULLY! 🔥",
  "",
  "✅ Your bot is live and ready to receive Free Fire sensitivity orders.",
  "",
  `⏰ Sent at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
].join("\n");

fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
})
  .then((r) => r.json())
  .then((d) => {
    if (d.ok) {
      console.log("🎉 SUCCESS! Message delivered to your Telegram.");
      console.log("Orders will now be notified automatically on payment.");
    } else {
      console.error("❌ Telegram error:", d.description);
      if (d.error_code === 403) {
        console.log("👉 Fix: Open Telegram → search @xpwotsensi_bot → tap START");
      }
    }
  })
  .catch((e) => console.error("Network error:", e.message));

