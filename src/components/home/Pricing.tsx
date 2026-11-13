import React from "react";
import Link from "next/link";
import { Check, Zap, Sparkles, ShieldCheck } from "lucide-react";
import { SENSI_PACKAGES, PACKAGE_IDS } from "@/config/packages";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function Pricing() {
  const packs = PACKAGE_IDS.map((id) => SENSI_PACKAGES[id]);

  return (
    <section id="packs" className="py-20 md:py-32 relative bg-background-secondary/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="orange" size="md">
            TRANSPARENT PRICING
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-tight">
            ONE PREMIUM PACK. <span className="text-accent">MADE FOR YOUR ANDROID.</span>
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base">
            Get every feature for ₹349, customized to your Android device.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 items-stretch max-w-xl mx-auto">
          {packs.map((pack) => {
            const isFeatured = pack.isPopular;

            return (
              <Card
                key={pack.id}
                hoverEffect
                className={`flex flex-col justify-between p-8 relative transition-all duration-300 ${
                  isFeatured
                    ? "bg-background-elevated/90 border-accent shadow-glow-orange lg:-translate-y-2 ring-1 ring-accent/30"
                    : "bg-background-card/90 border-border"
                }`}
              >
                {/* Popular Badge on Top */}
                {pack.badge && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-accent to-accent-secondary text-white text-[11px] font-heading font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {pack.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Pack Name & Tagline */}
                  <div className="mb-6">
                    <h3 className="font-heading font-black text-2xl text-foreground tracking-wide">
                      {pack.name}
                    </h3>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      {pack.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-border/80">
                    <span className="font-heading font-black text-4xl sm:text-5xl text-foreground">
                      ₹{pack.price}
                    </span>
                    <span className="text-sm font-medium text-foreground-muted line-through">
                      ₹{pack.originalPrice}
                    </span>
                    <span className="text-xs font-mono text-accent ml-auto">
                      One-time fee
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <div className="text-xs font-mono uppercase text-foreground-muted tracking-wider">
                      Included in this pack:
                    </div>
                    {pack.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-foreground-muted">
                        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5 text-accent">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & CTA */}
                <div className="space-y-4 pt-4 border-t border-border/60">
                  <Link href={`/order?pack=${pack.id}`} className="block w-full">
                    <Button
                      variant={isFeatured ? "primary" : "secondary"}
                      size="lg"
                      className="w-full font-heading"
                      rightIcon={isFeatured ? <Zap className="w-4 h-4 fill-white" /> : undefined}
                    >
                      GET PREMIUM SENSI
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-foreground-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    <span>Safe & anti-ban compliant</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
