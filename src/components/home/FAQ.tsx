import React from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FAQ() {
  const faqItems: AccordionItem[] = [
    {
      id: "faq-1",
      question: "What is a sensitivity pack?",
      answer:
        "A sensitivity pack is a complete, custom-tailored configuration of all in-game Free Fire sensitivity parameters (General, Red Dot, 2x Scope, 4x Scope, Sniper Scope, Free Look) and optional recommended phone display settings (such as touch sensitivity and DPI) engineered for your specific smartphone model, RAM, screen refresh rate, and claw layout.",
    },
    {
      id: "faq-2",
      question: "Is every pack customized for my phone?",
      answer:
        "Yes, absolutely. Unlike generic YouTube sensitivity numbers that fail because they were recorded on an iPad or different processor, XPWOT calculates values based on your exact device specs, RAM size, touch response time, and selected finger layout (2, 3, 4, or 5 fingers).",
    },
    {
      id: "faq-3",
      question: "Do I need to share my Free Fire password or OTP?",
      answer:
        "NEVER! We will NEVER ask for your game password, OTP, Facebook/Google credentials, or account login. You simply provide your in-game UID (for profile identification) and phone hardware details. The settings are delivered as a clean configuration guide you manually enter into your game's Settings menu.",
    },
    {
      id: "faq-4",
      question: "How will I receive my settings?",
      answer:
        "Your sensitivity configuration sheet and setup instructions are delivered directly to your registered WhatsApp number or Telegram handle by our support team upon payment verification. You will also receive an order confirmation receipt immediately.",
    },
    {
      id: "faq-5",
      question: "How long does delivery take?",
      answer:
        "Basic Pack settings are delivered within 12 - 24 hours. Pro Pack orders receive priority delivery within 4 - 8 hours. Premium Tournament orders receive express priority delivery within 2 - 4 hours.",
    },
    {
      id: "faq-6",
      question: "Can I request support after purchase?",
      answer:
        "Yes! If your drag speed feels too fast or too slow after applying the settings, you can message our dedicated support team on WhatsApp (+91 93419 23708) or Telegram (@xpwot) within 7 days for fine-tuning advice tailored to your screen protector and swipe habits.",
    },
    {
      id: "faq-7",
      question: "Will these settings guarantee 100% headshots?",
      answer:
        "No. We take competitive integrity and honesty seriously: no settings can magically guarantee headshots or rank promotions without player muscle memory, crosshair placement, and practice. Our settings eliminate hardware drag inconsistencies, overshooting, and screen jitter, giving your fingers the smoothest mechanical foundation to land accurate shots.",
    },
    {
      id: "faq-8",
      question: "What is your refund policy?",
      answer: (
        <span>
          We provide refunds in cases of duplicate payments, technical payment debits without order generation, or non-delivery past the stated delivery SLA. Because customized sensitivity configurations are tailored digital services, delivered packs are evaluated according to our published{" "}
          <Link href="/refund-policy" className="text-accent underline font-semibold">
            Refund & Cancellation Policy
          </Link>
          .
        </span>
      ),
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <Badge variant="orange" size="md">
            COMMON QUESTIONS
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-tight">
            FREQUENTLY ASKED <span className="text-accent">QUESTIONS</span>
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base">
            Everything you need to know about XPWOT sensitivity packs, device tuning, safety, and delivery.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion items={faqItems} defaultOpenId="faq-1" />

        {/* Still Have Questions Banner */}
        <div className="mt-12 p-6 rounded-card bg-background-secondary/80 border border-border text-center space-y-3">
          <h3 className="font-heading font-bold text-lg text-foreground">
            Still have a question before ordering?
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
            Our Indian support team is live on WhatsApp and Telegram to help you choose the best setup for your smartphone.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-background-elevated border border-border hover:border-accent/40 text-foreground text-xs font-heading font-semibold hover:text-accent transition-all"
            >
              <MessageCircle className="w-4 h-4 text-accent" />
              Chat on WhatsApp ({siteConfig.contact.whatsappDisplay})
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

