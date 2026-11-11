import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Background glowing glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-accent/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] bg-gradient-to-b from-background-elevated/90 to-background-card/90 border border-accent/40 p-8 sm:p-12 md:p-16 text-center shadow-glow-orange overflow-hidden">
          {/* Subtle Cyber Grid in Card */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase bg-accent/10 px-3.5 py-1 rounded-full border border-accent/25">
              PRECISION MEETS PERFORMANCE
            </span>

            <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight">
              READY TO UPGRADE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
                YOUR SETUP?
              </span>
            </h2>

            <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
              Your device. Your play style. Your customized sensitivity. Join serious Free Fire players who stopped guessing and started playing with settings built for their phones.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/order?pack=pro" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base shadow-glow-orange-lg px-8 py-4 font-heading"
                  rightIcon={<Zap className="w-5 h-5 fill-white" />}
                >
                  CHOOSE YOUR SENSI
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono text-foreground-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Zero Ban Risk</span>
              </div>
              <span>•</span>
              <div>Human Support Included</div>
              <span>•</span>
              <div>Direct WhatsApp Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

