import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OrderForm } from "@/components/order/OrderForm";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Crosshair, Sparkles } from "lucide-react";
import { PackageId } from "@/config/packages";

export const metadata: Metadata = {
  title: "Order Your Custom Sensitivity Pack | XPWOT",
  description:
    "Enter your phone brand, RAM, screen refresh rate and play style to get customized Free Fire sensitivity settings.",
};

interface OrderPageProps {
  searchParams: { pack?: string };
}

export default function OrderPage({ searchParams }: OrderPageProps) {
  const initialPackId: PackageId = "premium";

  return (
    <div className="py-12 md:py-20 relative bg-grid-pattern min-h-screen">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="orange" size="md" className="gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOM DEVICE TUNING</span>
          </Badge>

          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
            LET&apos;S BUILD <span className="text-accent">YOUR SENSI</span>
          </h1>

          <p className="text-foreground-muted text-sm sm:text-base max-w-xl mx-auto">
            Tell us about your smartphone specifications, RAM, and play style. We&apos;ll craft settings engineered for your exact setup.
          </p>
        </div>

        {/* The Checkout Order Form */}
        <Suspense fallback={<div className="text-center py-12 text-foreground-muted">Loading checkout...</div>}>
          <OrderForm initialPackId={initialPackId} />
        </Suspense>
      </div>
    </div>
  );
}
