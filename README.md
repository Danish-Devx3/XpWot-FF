# XPWOT — Premium Free Fire Sensitivity Store

> **Precision Meets Performance**  
> An esports gaming e-commerce platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, MongoDB, and Razorpay Checkout, engineered to sell custom Free Fire and Free Fire MAX sensitivity settings to players across India.

---

## ⚡ Features & Architecture

- **Esports Dark Aesthetics**: Futuristic gaming design with dark palette (`#08090B`, `#101216`, `#15181E`), neon orange accents (`#FF6B24`), ambient glow, Space Grotesk headings, and Inter body text.
- **Hardware-Specific Sensitivity Profiling**: Customers select exact phone model, RAM size (2GB to 12GB+), screen refresh rate (60Hz–144Hz), device DPI, target speed, primary play style (Rusher, Sniper, Balanced), and claw finger layout (2, 3, 4, 5+ fingers).
- **Production Payment Security**:
  - Authoritative server-side pricing from `src/config/packages.ts` (client values are never trusted).
  - Razorpay Checkout integration with UPI (GPay, PhonePe, Paytm, BHIM), Cards, and Net Banking.
  - Cryptographic HMAC SHA256 timing-safe signature verification on both client checkout callbacks and asynchronous webhooks.
  - Separation of keys: checkout uses `RAZORPAY_KEY_SECRET`; webhooks strictly use `RAZORPAY_WEBHOOK_SECRET`.
- **Database & Idempotency (Prisma + MongoDB)**:
  - Database schema defined in `prisma/schema.prisma`.
  - Atomic status updates (`notification_status: { not: "SENT" }`) guaranteeing **exactly-once** Telegram order alert delivery, even under concurrent webhook and checkout verification races.
  - Development fallback: Built-in persistent file cache when `DATABASE_URL` is not yet configured locally.
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
│   └── test-suite.js           # Automated validation & cryptographic test suite
│
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── create-order/route.ts      # Creates Razorpay order & stores record
    │   │   ├── razorpay-webhook/route.ts  # Handles payment.captured webhook
    │   │   ├── verify-payment/route.ts    # Timing-safe HMAC verification
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
    │   │   ├── OrderForm.tsx             # RHF + Zod + Razorpay orchestration
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
    │   ├── database.ts                   # Order persistence (Prisma Mongo + cache)
    │   ├── idempotency.ts                # Atomic lock against duplicate alerts
    │   ├── mongodb.ts                    # Native MongoDB driver connection
    │   ├── prisma.ts                     # Prisma client singleton
    │   ├── rate-limit.ts                 # Sliding-window IP rate limiter
    │   ├── razorpay.ts                   # Razorpay SDK & crypto verification
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
# Razorpay Credentials (Test Mode provided)
RAZORPAY_KEY_ID=rzp_test_TyYH4r13XB4ewE
RAZORPAY_KEY_SECRET=ne7WGDCgVi9IQXvopRHj2Sih
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TyYH4r13XB4ewE

# Razorpay Webhook Secret (Set inside Razorpay Dashboard > Webhooks)
RAZORPAY_WEBHOOK_SECRET=xpwot_webhook_secret_2026_secure

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

## 💳 Razorpay Test Mode Verification

The test credentials provided are ready to test checkout:
- **Key ID**: `rzp_test_TyYH4r13XB4ewE`
- **Key Secret**: `ne7WGDCgVi9IQXvopRHj2Sih`

### How to complete a test purchase:
1. Navigate to `/order?pack=pro`.
2. Enter your player details (e.g., Name: `Test Player`, UID: `1928374650`, WhatsApp: `9341923708`).
3. Select your smartphone, RAM, refresh rate, and play style.
4. Check the agreement checkbox and click **PAY SECURELY**.
5. When the Razorpay modal appears:
   - Select **UPI** or **Card**.
   - For Card, enter any standard Razorpay test card (e.g. `4111 1111 1111 1111`, expiry `12/28`, CVV `123`).
   - Click **Success** on the Razorpay simulation screen.
6. The client callback posts to `/api/verify-payment`, verifies HMAC signatures, locks the transaction idempotently, and redirects to `/success` with verified details.

> **Important**: Live payments require Razorpay KYC activation and generating live API keys (`rzp_live_...`). Never use test keys in production.

---

## 🤖 Telegram Bot Setup Instructions

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, name your bot (e.g. `XPWOT Order Notifier`), and choose a username ending in `bot`.
3. Copy the HTTP API token provided by BotFather and set it as `TELEGRAM_BOT_TOKEN` in `.env.local`.
4. Create a private Telegram channel or group for order alerts (e.g. `XPWOT Orders`).
5. Add your bot as an **Administrator** in the group/channel with &quot;Post Messages&quot; permission.
6. To get the `TELEGRAM_CHAT_ID`:
   - Send a message in the channel/group.
   - Forward it to `@userinfobot` or call `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser.
   - Copy the `chat.id` (channels usually start with `-100...`) into `TELEGRAM_CHAT_ID`.

### Sample Notification Dispatched:
```text
🔥 NEW PAID ORDER RECEIVED 🔥

Order ID: order_P8x123abc
Payment ID: pay_P8y456def
Amount: ₹599
Pack: PRO PACK

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

## 🌐 Razorpay Webhook Configuration

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings** > **Webhooks** > **Add New Webhook**.
3. Set **Webhook URL**: `https://your-domain.com/api/razorpay-webhook`.
4. Set **Secret**: Matches `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
5. Select Event: `payment.captured`.
6. Save the webhook.

---

## 🚢 Vercel Deployment Instructions

1. Push your repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and import your repository.
3. In **Environment Variables**, add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (`919341923708`)
   - `NEXT_PUBLIC_TELEGRAM_USERNAME` (`xpwot`)
   - `NEXT_PUBLIC_SITE_URL` (`https://your-domain.com`)
   - `DATABASE_URL` (MongoDB Atlas URI)
4. Click **Deploy**. Vercel will build Next.js and deploy your store globally with edge caching.

---

## 🧪 Testing Checklist

Run the automated verification suite:
```bash
node scripts/test-suite.js
```
- [x] Every navbar link points to valid sections (`/#packs`, `/#how-it-works`, `/#faq`, `/contact`).
- [x] Every pricing CTA carries the selected pack query param (`/order?pack=basic`, `pro`, `premium`).
- [x] Client form validates Free Fire UID (must be numbers only, 6–15 digits).
- [x] Client form validates Indian WhatsApp numbers (strictly 10 digits starting with 6, 7, 8, or 9).
- [x] Unchecked terms checkbox prevents payment submission.
- [x] Prices on checkout match server configuration and cannot be modified by client requests.
- [x] HMAC SHA256 timing-safe signature verification rejects tampered payments.
- [x] Webhook verification rejects signatures created with the key secret instead of the webhook secret.
- [x] Concurrent calls to webhook and checkout callback do not create duplicate Telegram notifications.
- [x] `/success` page rejects unverified or non-paid orders.

---

© 2026 XPWOT. All rights reserved. Precision Meets Performance.

