"use client";

import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Check, Sparkles } from "lucide-react";
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
            <button
              type="button"
              key={id}
              onClick={() => setValue("packageId", id, { shouldValidate: true })}
              aria-pressed={isSelected}
              className={`w-full p-5 rounded-xl border text-left transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? "bg-accent/15 border-accent shadow-glow-orange ring-1 ring-accent"
                  : "bg-background-elevated border-border hover:border-accent/60"
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-black text-lg text-foreground tracking-wide">
                    {pack.name}
                  </h3>
                  {pack.badge && (
                    <span className="text-[10px] font-mono font-bold bg-accent text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {pack.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed mt-1">
                  {pack.tagline}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-2xl text-foreground">
                    ₹{pack.price}
                  </span>
                  <span className="text-xs text-foreground-muted line-through">
                    ₹{pack.originalPrice}
                  </span>
                </div>
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "bg-accent border-accent text-white"
                      : "border-border text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
