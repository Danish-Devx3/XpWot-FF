"use client";

import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Check, Sparkles, Zap } from "lucide-react";
import { SENSI_PACKAGES, PACKAGE_IDS, PackageId } from "@/config/packages";
import { OrderFormSchemaType } from "@/lib/validation";

interface PackageSelectorProps {
  setValue: UseFormSetValue<OrderFormSchemaType>;
  watch: UseFormWatch<OrderFormSchemaType>;
}

export function PackageSelector({ setValue, watch }: PackageSelectorProps) {
  const selectedPackageId = watch("packageId");

  return (
    <div className="bg-background-card rounded-card border border-border p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 font-mono font-bold text-accent flex items-center justify-center text-sm">
          D
        </span>
        <div>
          <h2 className="font-heading font-bold text-lg md:text-xl text-foreground">
            SELECT SENSI PACK
          </h2>
          <p className="text-xs text-foreground-muted">
            One premium pack for all Android devices, personalized to your phone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PACKAGE_IDS.map((id) => {
          const pack = SENSI_PACKAGES[id];
          const isSelected = selectedPackageId === id;

          return (
            <div
              key={id}
              onClick={() => setValue("packageId", id, { shouldValidate: true })}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                isSelected
                  ? "bg-accent/15 border-accent shadow-glow-orange ring-1 ring-accent"
                  : "bg-background-elevated border-border hover:border-border/80"
              }`}
            >
              {pack.badge && (
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-mono font-bold bg-accent text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {pack.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-heading font-black text-lg text-foreground tracking-wide">
                  {pack.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-2 mb-3">
                  <span className="font-heading font-black text-2xl text-foreground">
                    ₹{pack.price}
                  </span>
                  <span className="text-xs text-foreground-muted line-through">
                    ₹{pack.originalPrice}
                  </span>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed mb-4">
                  {pack.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-foreground-muted">Delivery:</span>
                <span className="text-accent font-semibold">{pack.deliveryEstimate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
