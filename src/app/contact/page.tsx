import React from "react";
import type { Metadata } from "next";
import { MessageCircle, Send, Clock, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createPageMetadata(
  "Contact XPWOT Support",
  "Get help with Free Fire sensitivity settings, device compatibility, or an existing order from XPWOT support.",
  "/contact"
);

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24 relative bg-grid-pattern min-h-screen">
      {/* Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="orange" size="md">
            HUMAN SUPPORT DESK
          </Badge>
          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
            CONNECT WITH <span className="text-accent">XPWOT</span>
          </h1>
          <p className="text-foreground-muted text-sm sm:text-base max-w-xl mx-auto">
            Have questions about your smartphone compatibility or need help with an existing order? Our team is active on WhatsApp and Telegram.
          </p>
        </div>

        {/* Support Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp Card */}
          <Card hoverEffect className="p-8 border-border bg-background-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center text-success shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-success uppercase tracking-wider font-bold">
                  DIRECT ORDER & RE-TUNING DESK
                </span>
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  WhatsApp Support
                </h2>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Fastest response for order delivery, payment verification, and 1-on-1 sensitivity fine-tuning.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-background-elevated border border-border text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Number:</span>
                  <span className="text-foreground font-bold">{siteConfig.contact.whatsappDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Typical Response:</span>
                  <span className="text-success font-semibold">15 – 30 Minutes</span>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Hi%20XPWOT%20Team%2C%20I%20have%20an%20inquiry%20regarding%20sensitivity%20settings.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full font-heading text-sm"
                leftIcon={<MessageCircle className="w-4 h-4" />}
              >
                CHAT ON WHATSAPP
              </Button>
            </a>
          </Card>

          {/* Telegram Card */}
          <Card hoverEffect className="p-8 border-border bg-background-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow-orange">
                <Send className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-bold">
                  COMMUNITY & SENSITIVITY DROPS
                </span>
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  Telegram Channel
                </h2>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Join our official Telegram community for future sensitivity updates, tournament tips, and direct support.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-background-elevated border border-border text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Channel:</span>
                  <span className="text-foreground font-bold">@{siteConfig.contact.telegramUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Updates:</span>
                  <span className="text-accent font-semibold">Regular Esports Guides</span>
                </div>
              </div>
            </div>

            <a
              href={siteConfig.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full font-heading text-sm"
                leftIcon={<Send className="w-4 h-4" />}
              >
                CONTACT ON TELEGRAM
              </Button>
            </a>
          </Card>
        </div>

        {/* Operating Hours & Safety Info Banner */}
        <Card className="p-6 md:p-8 border-border bg-background-card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground font-heading font-bold text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span>Operating Hours</span>
              </div>
              <p className="text-xs text-foreground-muted">
                {siteConfig.contact.hours}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground font-heading font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Security Reminder</span>
              </div>
              <p className="text-xs text-foreground-muted">
                We will NEVER ask for your game password or OTP.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground font-heading font-bold text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span>Official Email</span>
              </div>
              <p className="text-xs text-foreground-muted font-mono">
                {siteConfig.contact.email}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
