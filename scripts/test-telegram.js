// Quick test script to verify your Telegram Bot connection
require("dotenv").config({ path: ".env.local" });
if (!process.env.TELEGRAM_BOT_TOKEN) {
  require("dotenv").config({ path: ".env" });
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function testTelegram() {
  console.log("\n--- Testing Telegram Bot Integration ---");

  if (!token || token.trim().length === 0) {
    console.error("❌ Error: TELEGRAM_BOT_TOKEN is not set in .env or .env.local");
    console.log("👉 Follow the instructions to get your bot token from @BotFather on Telegram.");
    process.exit(1);
  }

  if (!chatId || chatId.trim().length === 0) {
    console.error("❌ Error: TELEGRAM_CHAT_ID is not set in .env or .env.local");
    console.log("👉 Follow the instructions to get your chat ID from @userinfobot on Telegram.");
    process.exit(1);
  }

  console.log(`Connecting with Token: ${token.substring(0, 10)}...`);
  console.log(`Sending test notification to Chat ID: ${chatId}`);

  const testMessage = [
    "🔥 XPWOT TELEGRAM BOT CONNECTED SUCCESSFULLY! 🔥",
    "",
    "✅ Your Telegram bot is active and ready to receive live Free Fire sensitivity orders.",
    "",
    `⏰ Sent at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      console.log("\n🎉 SUCCESS! Test message delivered to your Telegram.");
      console.log("Whenever a customer pays on XPWOT, order details will automatically arrive here!\n");
    } else {
      console.error("\n❌ Telegram API returned an error:", data.description);
      console.log("Tip: If messaging a user, make sure you clicked 'Start' in the bot chat first.");
      console.log("Tip: If messaging a group/channel, make sure the bot is an Admin.\n");
    }
  } catch (err) {
    console.error("Network error:", err.message);
  }
}

testTelegram();

