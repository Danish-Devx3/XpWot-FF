import React from "react";
import Link from "next/link";
import { Crosshair, MessageCircle, Send, ShieldCheck, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t border-border relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center font-heading font-black text-white text-lg tracking-tighter shadow-glow-orange">
                <Crosshair className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-2xl tracking-wider text-white">
                XP<span className="text-accent">WOT</span>
              </span>
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Precision Meets Performance. Premium Free Fire sensitivity calibration tailored to your exact smartphone specs, RAM, screen refresh rate, and finger play style.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-accent hover:border-accent/40 transition-colors"
                aria-label="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-accent hover:border-accent/40 transition-colors"
                aria-label="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground-muted">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#packs" className="hover:text-accent transition-colors">
                  Sensi Packs & Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-accent transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/order?pack=premium" className="hover:text-accent transition-colors">
                  Build Your Sensi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground-muted">
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-accent transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact Support
                </Link>
              </li>
              <li className="pt-2 flex items-center gap-1.5 text-xs text-success">
                <ShieldCheck className="w-4 h-4" /> 100% Anti-Ban Guarantee
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              Direct Support
            </h4>
            <p className="text-xs text-foreground-muted">
              Have questions before ordering or need post-delivery assistance? Reach our human support team.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border">
                <span className="text-foreground-muted">WhatsApp</span>
                <span className="font-mono text-accent font-medium">{siteConfig.contact.whatsappDisplay}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border">
                <span className="text-foreground-muted">Telegram</span>
                <span className="font-mono text-accent font-medium">@{siteConfig.contact.telegramUsername}</span>
              </div>
              <div className="text-[11px] text-foreground-muted pt-1">
                Hours: {siteConfig.contact.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 space-y-4 text-xs text-foreground-muted">
          <div className="p-4 rounded-xl bg-background-card/60 border border-border/70 text-center md:text-left leading-relaxed">
            <span className="font-bold text-foreground">Disclaimer: </span>
            {siteConfig.disclaimer} All game trademarks, logos, and brand names are the property of their respective owners. XPWOT provides custom configuration advisory services based on device hardware metrics.
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p>© {currentYear} XPWOT. All rights reserved. Precision Meets Performance.</p>
            <p className="flex items-center gap-1 text-[11px]">
              Crafted for the Indian Mobile Esports Community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
