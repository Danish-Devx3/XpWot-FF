import React from "react";
import { MessageSquare, Image as ImageIcon, CheckCircle, Shield, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ProofSection() {
  const proofPlaceholders = [
    {
      title: "WhatsApp Delivery Slip Placeholder",
      category: "DELIVERY PROOF",
      description: "Replace with genuine screenshot of sensitivity PDF/matrix delivered to customer WhatsApp.",
      recommendedSize: "1080 x 1350 px (Portrait)",
      icon: MessageSquare,
      imageSlotId: "proof_slot_whatsapp_1",
    },
    {
      title: "In-Game Sensitivity Matrix Example",
      category: "HUD CONFIGURATION",
      description: "Replace with sample calibrated layout sheet showing scope sensitivities for Poco / Redmi devices.",
      recommendedSize: "1920 x 1080 px (16:9)",
      icon: FileCheck,
      imageSlotId: "proof_slot_matrix_2",
    },
    {
      title: "Real Customer Feedback Placeholder",
      category: "PLAYER RESPONSE",
      description: "Replace with genuine unedited chat review or gameplay feedback received post-delivery.",
      recommendedSize: "1080 x 1080 px (Square)",
      icon: CheckCircle,
      imageSlotId: "proof_slot_feedback_3",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative bg-background-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-heading font-semibold text-accent uppercase tracking-widest">
            Transparency First
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-tight">
            REAL CUSTOMIZATION. <span className="text-accent">HUMAN SUPPORT.</span>
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base">
            We don&apos;t use fake bots or fabricated reviews. Below are genuine delivery verification slots where genuine customer interactions and sensitivity delivery sheets are showcased.
          </p>
        </div>

        {/* Proof Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {proofPlaceholders.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                hoverEffect
                className="border border-border bg-background-card overflow-hidden flex flex-col justify-between"
              >
                {/* Proof Visual Placeholder Frame */}
                <div className="h-56 bg-background-elevated/70 border-b border-border relative flex flex-col items-center justify-center p-6 text-center group">
                  {/* Subtle Grid Accent */}
                  <div className="absolute inset-0 bg-dot-pattern opacity-40" />

                  <div className="relative z-10 flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-background-card border border-border/80 flex items-center justify-center text-accent/80 shadow-inner group-hover:scale-105 group-hover:text-accent transition-all">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-accent/90 bg-accent/10 px-2.5 py-1 rounded border border-accent/20">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-foreground-muted">
                      Slot ID: {item.imageSlotId}
                    </span>
                  </div>
                </div>

                {/* Proof Information Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent shrink-0" />
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-3 border-t border-border/50 text-[11px] font-mono text-foreground-muted/80 flex items-center justify-between">
                    <span>Rec. Ratio:</span>
                    <span>{item.recommendedSize}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Owner instruction banner */}
        <div className="mt-10 p-4 rounded-xl bg-background-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-accent shrink-0" />
            <span>
              Store Owner Tip: Place your genuine delivery screenshots in <code className="text-accent bg-background-elevated px-1.5 py-0.5 rounded">public/proofs/</code> to replace these slots.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

