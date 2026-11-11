import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions | XPWOT",
  description: "Terms and conditions governing custom Free Fire sensitivity consulting and advisory services provided by XPWOT.",
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12 border-b border-border pb-8">
        <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
          LEGAL AGREEMENT
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
          TERMS & <span className="text-accent">CONDITIONS</span>
        </h1>
        <p className="text-sm text-foreground-muted">
          Last Updated: November 2026 • Governed under the Information Technology Act, 2000 & Consumer Protection Act (India).
        </p>
      </div>

      <div className="space-y-10 text-foreground-muted text-sm sm:text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            1. Service Description
          </h2>
          <p>
            XPWOT (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides customized digital sensitivity parameter recommendations and configuration guides for mobile esports titles, specifically Free Fire and Free Fire MAX. All services are purely educational and advisory in nature, designed to help individual players calibrate in-game controls to their hardware specifications (device model, RAM, display refresh rate, touch sampling rate, and finger play style).
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            2. Strict No-Credentials Guarantee
          </h2>
          <div className="p-4 rounded-xl bg-background-elevated border border-accent/30 text-foreground text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <strong>Security Protocol: </strong>
              XPWOT will <strong>NEVER</strong> ask for, request, collect, or store your Free Fire password, OTP, Google/Facebook/VK login credentials, or game account tokens. If anyone claiming to represent XPWOT asks for your password, immediately report them to our verified channels.
            </div>
          </div>
          <p>
            You only provide your public in-game numerical UID (for identification purposes) and smartphone specifications. You manually enter the recommended sensitivity values into your game client.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            3. Customer Information Accuracy
          </h2>
          <p>
            Customers are solely responsible for providing accurate device details, WhatsApp mobile numbers, and in-game IDs. Because sensitivity settings are calculated using hardware coefficients, incorrect device submissions (such as providing an incorrect processor or RAM size) will result in inaccurate calibration. XPWOT is not liable for delivery failures arising from invalid phone numbers or messaging blocks.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            4. Payment Terms
          </h2>
          <p>
            All prices are denominated in Indian Rupees (INR) and are listed transparently on the website. Payments are securely processed through Razorpay using authorized Indian banking instruments, including Unified Payments Interface (UPI - Google Pay, PhonePe, Paytm, BHIM), debit cards, credit cards, and net banking. Prices are server-validated and cannot be modified on the client side.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            5. Manual Delivery Process & SLA
          </h2>
          <p>
            To guarantee personalized quality control, sensitivity settings are prepared by human sensitivity analysts and delivered manually to the customer&apos;s registered WhatsApp or Telegram handle.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Basic Pack:</strong> Delivered within 12 - 24 hours.</li>
            <li><strong>Pro Pack:</strong> Priority delivery within 4 - 8 hours.</li>
            <li><strong>Premium Tournament Pack:</strong> Express priority delivery within 2 - 4 hours.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            6. Performance Disclaimer & Skill Variance
          </h2>
          <p>
            XPWOT provides sensitivity numbers calculated to reduce drag jitter and optimize screen swipes. However, gameplay performance in competitive shooters is fundamentally dependent on individual player hand-eye coordination, reaction times, network latency (ping), finger positioning, device thermal throttling, and consistent practice.
          </p>
          <p className="font-medium text-foreground">
            We do NOT guarantee automatic headshots, infallible win rates, or specific rank achievements. Any marketing references to &quot;advantage&quot; describe mechanical comfort and reduced swipe resistance.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            7. Intellectual Property & Third-Party Disclaimer
          </h2>
          <p>
            {siteConfig.disclaimer} Free Fire, Free Fire MAX, and Garena are registered trademarks of Garena International I Private Limited. XPWOT is an independent third-party advisory consultancy and has no formal association, sponsorship, or licensing agreement with Garena.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            8. Contact & Grievance Redressal
          </h2>
          <p>
            In accordance with the Information Technology Rules, 2021, customers may direct questions, delivery inquiries, or formal grievances to:
          </p>
          <div className="p-4 rounded-xl bg-background-card border border-border text-xs font-mono space-y-1">
            <div>Support Desk: XPWOT Customer Operations</div>
            <div>WhatsApp: {siteConfig.contact.whatsappDisplay}</div>
            <div>Telegram: {siteConfig.contact.telegramLink}</div>
            <div>Email: {siteConfig.contact.email}</div>
            <div>Working Hours: {siteConfig.contact.hours}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

