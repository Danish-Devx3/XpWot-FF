# XPWOT — Premium Free Fire Sensitivity Store

> **Precision Meets Performance**  
> An esports gaming e-commerce platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, MongoDB, and ZapUPI, engineered to sell custom Free Fire and Free Fire MAX sensitivity settings to players across India.

---

## ⚡ Features & Architecture

- **Esports Dark Aesthetics**: Futuristic gaming design with dark palette (`#08090B`, `#101216`, `#15181E`), neon orange accents (`#FF6B24`), ambient glow, Space Grotesk headings, and Inter body text.
- **Hardware-Specific Sensitivity Profiling**: Customers select exact phone model, RAM size (2GB to 12GB+), screen refresh rate (60Hz–144Hz), device DPI, target speed, primary play style (Rusher, Sniper, Balanced), and claw finger layout (2, 3, 4, 5+ fingers).
- **Free Sensitivity Finder**: The home page provides a responsive, server-validated profile finder and copy/download result card. Sensitivity values are clearly identified as configurable starting presets, not verified device-specific settings. Recommended DPI is returned only for the four supplied RAM mappings at a current DPI of 360; other combinations show an unavailable notice.
- **Single Premium Offer**: One Premium pack for all Android devices, customized to each customer's phone details, priced at ₹349 (reduced from ₹500).
- **Production Payment Security**:
  - Authoritative server-side pricing from `src/config/packages.ts` (client values are never trusted).
  - ZapUPI order creation with server-validated INR pricing and same-tab payment redirects.
  - Every order supplies the deployed webhook URL to ZapUPI. The webhook triggers a server-side order-status check; only a verified success with a matching amount and transaction ID can mark an order paid.
  - Payment return also checks status server-side, so customer redirects do not act as proof of payment.
  - Production rejects ZapUPI test-environment payments and `DUMMY` transaction IDs.
- **Database & Idempotency (Prisma + MongoDB)**:
  - Database schema defined in `prisma/schema.prisma`.
  - Atomic status updates (`notification_status: { not: "SENT" }`) preventing duplicate Telegram alerts across webhook and status checks.
  - Development fallback: Built-in persistent file cache when MongoDB is not configured or temporarily unreachable locally. Production requires a working MongoDB connection; serverless deployments do not write orders to the read-only app filesystem.
- **Telegram Bot Notifications**: Automated, sanitized, instant order alert dispatched to your private Telegram channel/chat formatted with customer game UID, phone hardware, claw style, and IST timestamp.
- **Anti-Fraud Success Protection**: `/success` page actively verifies payment status with the server before rendering the confirmed receipt; direct URL visits cannot bypass payment checks.
- **Compliance & Legal Readiness**: Includes dedicated Terms & Conditions, Consumer Protection compliant Refund Policy, Contact desk, and third-party disclaimers (not affiliated with Garena/Free Fire).

---

## 📁 Complete Folder Structure

```
c:\Users\ddon8\coding\XpWot FF/
├── .env.example                # Example environment variables
├── .env.local                  # Local secrets and API keys (configured)
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
│
├── prisma/
│   └── schema.prisma           # Prisma MongoDB Order Model
│
├── public/                     # Static assets and icons
│
├── scripts/
│   └── test-suite.js           # Automated checkout and webhook validation
│
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── create-order/route.ts      # Creates ZapUPI order & stores record
    │   │   ├── sensitivity/find/route.ts  # Validates and calculates free profiles
    │   │   ├── zapupi-webhook/route.ts    # Confirms ZapUPI webhook events
    │   │   └── verify-status/route.ts     # Server verification for /success page
    │   ├── contact/page.tsx               # Direct WhatsApp & Telegram contact
    │   ├── globals.css                    # Esports patterns, scrollbars & glow
    │   ├── layout.tsx                     # Root Layout & Metadata
    │   ├── order/page.tsx                 # Full multi-step checkout form
    │   ├── page.tsx                       # High-converting landing page
    │   ├── refund-policy/page.tsx         # Legal Indian refund guidelines
    │   ├── robots.ts                      # SEO robots.txt configuration
    │   ├── sitemap.ts                     # Dynamic XML sitemap
    │   ├── success/page.tsx               # Verified payment success screen
    │   └── terms/page.tsx                 # Terms & conditions of service
    │
    ├── components/
    │   ├── home/
    │   │   ├── DpiCalculator.tsx          # Free sensitivity finder and result card
    │   │   ├── DeviceCompatibility.tsx   # Phone brand cards (Poco, Realme, etc.)
    │   │   ├── FAQ.tsx                   # 8-question gaming accordion
    │   │   ├── FinalCTA.tsx              # Conversion closing section
    │   │   ├── Hero.tsx                  # Two-column hero with animated HUD
    │   │   ├── HowItWorks.tsx            # 3-step walkthrough
    │   │   ├── Pricing.tsx               # Basic, Pro, & Premium cards
    │   │   ├── ProofSection.tsx          # Real delivery screenshot slots
    │   │   └── TrustStrip.tsx            # Trust badges & indicators
    │   ├── layout/
    │   │   ├── Footer.tsx                # Branding, links, disclaimer
    │   │   ├── MobileMenu.tsx            # Slide-over navigation panel
    │   │   └── Navbar.tsx                # Sticky translucent Esports header
    │   ├── order/
    │   │   ├── DeviceDetails.tsx         # RAM, chipset, refresh rate, DPI
    │   │   ├── OrderForm.tsx             # RHF + Zod + ZapUPI checkout
    │   │   ├── PackageSelector.tsx       # Package switcher with server prices
    │   │   ├── PlayerDetails.tsx         # Name, Game UID, WhatsApp, Telegram
    │   │   └── PlayStyle.tsx             # Rusher/Sniper/Balanced & Finger layout
    │   └── ui/
    │       ├── Accordion.tsx             # Smooth animated accordion
    │       ├── Badge.tsx                 # Neon glowing badges
    │       ├── Button.tsx                # Animated CTA with glow & loading state
    │       └── Card.tsx                  # Esports elevated dark card
    │
    ├── config/
    │   ├── devices.ts                    # Indian smartphone brands & suggestions
    │   ├── packages.ts                   # Authoritative server packages & prices
    │   └── site.ts                       # Public site metadata & support info
    │
    ├── lib/
    │   ├── dpi-calculator.js              # Verified RAM/DPI reference mappings
    │   ├── sensitivity-calculator.ts      # Validated rule-based profile generation
    │   ├── database.ts                   # Order persistence (Prisma Mongo + cache)
    │   ├── idempotency.ts                # Atomic lock against duplicate alerts
    │   ├── mongodb.ts                    # Native MongoDB driver connection
    │   ├── prisma.ts                     # Prisma client singleton
    │   ├── rate-limit.ts                 # Sliding-window IP rate limiter
    │   ├── zapupi.ts                     # ZapUPI create-order and status API
    │   ├── zapupi-payment.ts             # Server-side payment confirmation
    │   ├── sanitize.ts                   # Input sanitation & Telegram formatting
    │   ├── telegram.ts                   # Bot notification dispatch
    │   ├── utils.ts                      # Helpers & formatters
    │   └── validation.ts                 # Zod validation schemas
    │
    └── types/
        └── order.ts                      # Order, device, & payment TypeScript types
```

---

## ⚙️ Environment Variables (`.env.local`)

Copy `.env.example` to `.env.local` and customize your values:

```env
# ZapUPI API key
ZAPUPI_KEY=your_zapupi_api_key

# Telegram Notification Settings
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_telegram_channel_or_group_id

# Public Contact Info
NEXT_PUBLIC_WHATSAPP_NUMBER=919341923708
NEXT_PUBLIC_TELEGRAM_USERNAME=xpwot
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# MongoDB with Prisma (Production)
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/xpwot?retryWrites=true&w=majority
MONGODB_DB=xpwot
```

---

## 🚀 Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone <repo-url>
   cd "XpWot FF"
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 ZapUPI Checkout

Set `ZAPUPI_KEY` in `.env.local` and `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS
URL of your deployed site (no trailing slash). Each create-order request includes
`https://<your-domain>/api/zapupi-webhook` as its per-order `webhook_url`, alongside
the payment return URLs.
The app has no separate live/test toggle: it uses the `ZAPUPI_KEY` configured on
the server. For live payments, replace the deployment's key with the live key from
ZapUPI and redeploy; changing a dashboard mode alone does not update the deployed
environment variable.
If create-order returns `Insufficient Topup Balance`, the ZapUPI merchant account
needs funds; changing the API key does not resolve that balance error.

The checkout creates a unique order on the server and sends the customer to the
ZapUPI payment URL in the same tab. Both the webhook and the success page use
ZapUPI's order-status API; a payment is accepted only after the server verifies its
status, amount, and transaction ID. Both the merchant order ID and the `order_id`
returned by ZapUPI are stored; status checks use the returned ID, while the
webhook and success page can find the order by either ID.

### Configure the ZapUPI webhook

The app sends a per-order webhook override automatically. In the ZapUPI dashboard,
also configure the same URL under the account's **Webhook**, **Callback URL**, or
API settings if that option is available:

```text
https://your-domain.com/api/zapupi-webhook
```

Replace `your-domain.com` with the exact production hostname set in
`NEXT_PUBLIC_SITE_URL`. Use HTTPS and make sure the route is publicly reachable.
Set `NEXT_PUBLIC_SITE_URL` in Vercel to the deployed HTTPS origin (not
`localhost`) and redeploy after changing it. Check the endpoint in a browser:
`https://your-domain.com/api/zapupi-webhook` should return
`{"status":"ok","service":"zapupi-webhook"}`.

ZapUPI sends a JSON `POST` when an order's status changes. The receiver accepts the
documented fields (`order_id`, `status`, `txn_id`, `amount`, `pay_amount`, `utr`,
`customer_mobile`, `remark`, `remark_array`, `create_at`, and `environment`) and
responds with HTTP 200 and `{"status":"ok"}`. The webhook is only a signal to
recheck the order: the server calls ZapUPI's order-status API before updating the
payment record or sending a paid-order Telegram alert. Invalid, unknown, and test
webhooks are acknowledged without marking an order paid.

For production, use live ZapUPI credentials and a production `NEXT_PUBLIC_SITE_URL`.
Test-environment events and transaction IDs starting with `DUMMY` are acknowledged
but intentionally not accepted as paid in production. Their receipt appears in
Vercel Function Logs as an ignored test webhook; they do not trigger Telegram
delivery. For a real payment, the logs show webhook receipt followed by the
server-side verification result.

---

## 🤖 Telegram Bot Setup Instructions

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, name your bot (e.g. `XPWOT Order Notifier`), and choose a username ending in `bot`.
3. Copy the HTTP API token provided by BotFather and set it as `TELEGRAM_BOT_TOKEN` in `.env.local`.
4. Create a private Telegram channel or group for order alerts (e.g. `XPWOT Orders`).
5. Add your bot as an **Administrator** in the group/channel with &quot;Post Messages&quot; permission.
6. To get the `TELEGRAM_CHAT_ID`:
   - For a private bot chat, open the bot and press **Start**, then call `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`.
   - For a group/channel, send a message after adding the bot, then call the same `getUpdates` URL. For a channel, the bot must have permission to post.
   - Copy the `chat.id` (channels usually start with `-100...`) into `TELEGRAM_CHAT_ID`.
7. Add both values to your hosting provider's environment settings and redeploy. A paid order sends the detailed order alert only after server-side payment verification. If Telegram is unavailable, the payment stays paid and a later verification attempt can retry the notification.

### Sample Notification Dispatched:
```text
🔥 NEW PAID ORDER RECEIVED 🔥

Order ID: xpwot_4c8f...
Payment ID: ZAPUPI66f10bd3c1f28
Amount: ₹349
Pack: PREMIUM PACK

👤 PLAYER DETAILS:
Name: Sudhanshu Sinha
Free Fire ID: 1928374650
WhatsApp: 9341923708
Telegram: @xpwot

📱 DEVICE & SETTINGS:
Phone: Poco X6 Pro 5G
RAM: 8GB
Chipset: Dimensity 8300 Ultra
Refresh Rate: 120Hz
DPI: 411
Sensi Speed: HIGH
Play Style: RUSHER
Finger Layout: 4 Fingers

⏰ Time: 11 Nov 2026, 4:45:00 pm (IST)
```

---

## 🗄️ MongoDB & Prisma Production Setup

1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with Read and Write permissions.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or whitelist your deployment server IPs.
4. Obtain the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/xpwot?retryWrites=true&w=majority
   ```
5. Set `DATABASE_URL` in your hosting environment (Vercel, Railway, etc.).
6. Run `npx prisma db push` or `npx prisma generate` during your build step.

---

---

## 🚢 Vercel Deployment Instructions

1. Push your repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and import your repository.
3. In **Environment Variables**, add:
   - `ZAPUPI_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (`919341923708`)
   - `NEXT_PUBLIC_TELEGRAM_USERNAME` (`xpwot`)
   - `NEXT_PUBLIC_SITE_URL` (`https://your-domain.com`)
   - `DATABASE_URL` (MongoDB Atlas URI)
4. Click **Deploy**. After deployment, set the webhook URL in the ZapUPI dashboard to `https://your-domain.com/api/zapupi-webhook` if the dashboard provides a webhook setting. The app also sends this URL as the per-order override.
5. Confirm the deployed URL is the same hostname as `NEXT_PUBLIC_SITE_URL`, and test a payment using ZapUPI's live environment before accepting customer orders. Do not use test/DUMMY transactions as proof of payment.

---

## 🧪 Testing Checklist

Run the automated verification suite:
```bash
node scripts/test-suite.js
```
- [x] Every navbar link points to valid sections (`/#packs`, `/#how-it-works`, `/#faq`, `/contact`).
- [x] The single Premium pricing CTA links to `/order?pack=premium`.
- [x] Client form validates Free Fire UID (must be numbers only, 6–15 digits).
- [x] Client form validates Indian WhatsApp numbers (strictly 10 digits starting with 6, 7, 8, or 9).
- [x] Unchecked terms checkbox prevents payment submission.
- [x] Prices on checkout match server configuration and cannot be modified by client requests.
- [x] ZapUPI payment status and amount are confirmed server-side before orders are marked paid.
- [x] Concurrent webhook and status checks do not create duplicate Telegram notifications.
- [x] `/success` page rejects unverified or non-paid orders.

---

© 2026 XPWOT. All rights reserved. Precision Meets Performance.
