"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Flame, Crosshair, Shield, CheckCircle2 } from "lucide-react";
import { OrderFormSchemaType } from "@/lib/validation";
import { PLAY_STYLE_OPTIONS, FINGER_LAYOUT_OPTIONS } from "@/config/devices";

interface PlayStyleProps {
  register: UseFormRegister<OrderFormSchemaType>;
  errors: FieldErrors<OrderFormSchemaType>;
  setValue: UseFormSetValue<OrderFormSchemaType>;
  watch: UseFormWatch<OrderFormSchemaType>;
}

export function PlayStyle({ register, errors, setValue, watch }: PlayStyleProps) {
  const selectedStyle = watch("playStyle");
  const selectedFinger = watch("fingerLayout");

  const icons = {
    RUSHER: Flame,
    SNIPER: Crosshair,
    BALANCED: Shield,
  };

  return (
    <div className="bg-background-card rounded-card border border-border p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 font-mono font-bold text-accent flex items-center justify-center text-sm">
          C
        </span>
        <div>
          <h2 className="font-heading font-bold text-lg md:text-xl text-foreground">
            PLAY STYLE & FINGER CONTROLS
          </h2>
          <p className="text-xs text-foreground-muted">
            Calibrates red-dot drag speeds and scope stability based on your role.
          </p>
        </div>
      </div>

      {/* Play Style Selectable Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
          Primary Play Style <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAY_STYLE_OPTIONS.map((style) => {
            const Icon = icons[style.id as keyof typeof icons] || Crosshair;
            const isSelected = selectedStyle === style.id;

            return (
              <div
                key={style.id}
                onClick={() => setValue("playStyle", style.id as any, { shouldValidate: true })}
                className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent/15 border-accent shadow-glow-orange ring-1 ring-accent"
                    : "bg-background-elevated border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-accent text-white" : "bg-background-card text-foreground-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-accent" />}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground tracking-wide">
                    {style.title}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {errors.playStyle && (
          <p className="text-xs text-error font-medium">{errors.playStyle.message}</p>
        )}
      </div>

      {/* Finger Layout Options */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
          Preferred Finger Layout <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FINGER_LAYOUT_OPTIONS.map((item) => {
            const isSelected = selectedFinger === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setValue("fingerLayout", item.id as any, { shouldValidate: true })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-accent/15 border-accent shadow-glow-orange ring-1 ring-accent"
                    : "bg-background-elevated border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-bold text-xs text-foreground">
                    {item.id}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-accent" />}
                </div>
                <p className="text-[11px] text-foreground-muted leading-tight">
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>
        {errors.fingerLayout && (
          <p className="text-xs text-error font-medium">{errors.fingerLayout.message}</p>
        )}
      </div>
    </div>
  );
}

