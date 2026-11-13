import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata(
  "Refund and Cancellation Policy",
  "Read XPWOT's refund and cancellation policy for custom Free Fire sensitivity services and digital orders.",
  "/refund-policy"
);

export default function RefundPolicyPage() {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12 border-b border-border pb-8">
        <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
          CUSTOMER PROTECTION
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
          REFUND & <span className="text-accent">CANCELLATION POLICY</span>
        </h1>
        <p className="text-sm text-foreground-muted">
          Effective Date: November 2026 • Compliant with Consumer Protection (E-Commerce) Rules, 2020 (India).
        </p>
      </div>

      <div className="space-y-10 text-foreground-muted text-sm sm:text-base leading-relaxed">
        {/* Intro */}
        <p>
          At XPWOT, we believe in transparent business practices and customer satisfaction. While customized digital sensitivity configurations are personalized digital advisory services, we do <strong>not</strong> adopt a blanket &quot;no refunds under any circumstance&quot; stance. Below are our explicit, fair conditions governing cancellations and refunds.
        </p>

        {/* Eligible scenarios */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            1. Scenarios Eligible for a Full Refund (100%)
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-background-elevated border border-border">
              <h3 className="font-heading font-semibold text-foreground text-sm">
                A. Duplicate Payments / Accidental Double Deductions
              </h3>
              <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                If your bank account or UPI application was debited more than once for the same order due to gateway latency or duplicate submission, the duplicate charge will be refunded in full without questions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background-elevated border border-border">
              <h3 className="font-heading font-semibold text-foreground text-sm">
                B. Money Deducted But Order Failed / Not Registered
              </h3>
              <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                If your payment was debited from your bank but ZapUPI or our servers failed to confirm the order due to a network drop, the gateway may auto-reconcile within 24–48 hours. If it does not, contact our team with your transaction UTR so we can investigate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background-elevated border border-border">
              <h3 className="font-heading font-semibold text-foreground text-sm">
                C. Non-Delivery Past Guaranteed Service Window
              </h3>
              <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                If our team fails to deliver your sensitivity settings within 48 hours of order confirmation (and the delay is not caused by customer-provided unreachable contacts), you are eligible for an immediate full refund.
              </p>
            </div>
          </div>
        </section>

        {/* Non-eligible scenarios */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            2. Scenarios Ineligible for Refund
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Delivered Customized Goods:</strong> Once customized sensitivity values have been compiled and sent to your registered WhatsApp/Telegram, the advisory service has been rendered and cannot be retracted.
            </li>
            <li>
              <strong>Customer Gameplay Expectations:</strong> We do not refund purchases on the grounds that the settings did not instantly turn you into a tournament champion or yield 100% headshots. Gaming performance depends heavily on individual player aim and reflex habits.
            </li>
            <li>
              <strong>Change of Mind Post-Delivery:</strong> Deciding that you no longer play the game after receiving the settings does not qualify for a refund.
            </li>
          </ul>
        </section>

        {/* Re-tuning support */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            3. Free Re-Tuning & Adjustment Guarantee
          </h2>
          <p>
            If your settings feel slightly fast, slow, or inconsistent with your screen protector glass, you do not need to purchase another pack. We offer <strong>free sensitivity adjustments within 7 days</strong> of delivery. Simply message our WhatsApp support desk (+91 93419 23708) with feedback, and our analyst will recalibrate your values.
          </p>
        </section>

        {/* Refund Processing Timeline */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            4. Refund Processing Timelines
          </h2>
          <p>
            Approved refunds are initiated within <strong>24 business hours</strong> through the payment gateway back to the original payment source:
          </p>
          <div className="p-4 rounded-xl bg-background-secondary border border-border text-xs font-mono space-y-1.5">
            <div>• UPI payments: Crediting time depends on the bank or UPI provider.</div>
          </div>
        </section>

        {/* How to claim */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-foreground">
            5. How to Request a Refund or Report Payment Issue
          </h2>
          <p>
            To initiate a claim, reach out to our support channels with:
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            <li>Your Order ID (e.g. <code className="text-accent font-mono">order_...</code>)</li>
            <li>ZapUPI transaction ID or Bank UTR Reference Number</li>
            <li>Registered WhatsApp number</li>
          </ol>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Hi%2C%20I%20would%20like%20to%20request%20assistance%20with%20a%20refund%20or%20payment%20issue.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-background-elevated border border-border hover:border-accent/40 text-foreground text-xs font-heading font-semibold hover:text-accent transition-all"
            >
              Contact on WhatsApp ({siteConfig.contact.whatsappDisplay})
            </a>
            <a
              href={siteConfig.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-background-elevated border border-border hover:border-accent/40 text-foreground text-xs font-heading font-semibold hover:text-accent transition-all"
            >
              Contact on Telegram (@{siteConfig.contact.telegramUsername})
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
