"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Smartphone, Cpu, Gauge, Sliders, Zap } from "lucide-react";
import { OrderFormSchemaType } from "@/lib/validation";
import {
  POPULAR_DEVICES,
  RAM_OPTIONS,
  REFRESH_RATE_OPTIONS,
  SENSI_PREFERENCES,
} from "@/config/devices";

interface DeviceDetailsProps {
  register: UseFormRegister<OrderFormSchemaType>;
  errors: FieldErrors<OrderFormSchemaType>;
  setValue: UseFormSetValue<OrderFormSchemaType>;
  watchDeviceModel: string;
}

export function DeviceDetails({
  register,
  errors,
  setValue,
  watchDeviceModel,
}: DeviceDetailsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = POPULAR_DEVICES.filter((dev) =>
    watchDeviceModel
      ? dev.toLowerCase().includes(watchDeviceModel.toLowerCase())
      : true
  ).slice(0, 8);

  const quickModels = [
    "Poco X6 Pro",
    "Redmi Note 13",
    "Realme 12 Pro",
    "iQOO Z9",
    "OnePlus 12R",
    "Samsung A55",
  ];

  return (
    <div className="bg-background-card rounded-card border border-border p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 font-mono font-bold text-accent flex items-center justify-center text-sm">
          B
        </span>
        <div>
          <h2 className="font-heading font-bold text-lg md:text-xl text-foreground">
            DEVICE SPECIFICATIONS
          </h2>
          <p className="text-xs text-foreground-muted">
            Used to calibrate touch response, drag friction, and swipe distance.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Phone Brand & Model with Suggestion Dropdown */}
        <div className="space-y-1.5 relative">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Phone Brand & Model <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <Smartphone className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Poco X6 Pro, Realme Narzo 70, Samsung S23"
              {...register("deviceModel")}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>

          {/* Quick Select Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            <span className="text-[11px] text-foreground-muted mr-1">Popular:</span>
            {quickModels.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setValue("deviceModel", m, { shouldValidate: true })}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-background-secondary hover:bg-accent/20 hover:text-accent border border-border text-foreground-muted transition-colors"
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search Dropdown Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-background-elevated border border-border rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => {
                    setValue("deviceModel", item, { shouldValidate: true });
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-accent/15 hover:text-accent transition-colors flex items-center justify-between"
                >
                  <span>{item}</span>
                  <span className="text-[10px] text-foreground-muted font-mono">Suggested</span>
                </button>
              ))}
            </div>
          )}

          {errors.deviceModel && (
            <p className="text-xs text-error font-medium">{errors.deviceModel.message}</p>
          )}
        </div>

        {/* RAM & Refresh Rate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* RAM */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
              Device RAM <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <Cpu className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                {...register("ram")}
                className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm text-foreground transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Phone RAM</option>
                {RAM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} RAM
                  </option>
                ))}
              </select>
            </div>
            {errors.ram && (
              <p className="text-xs text-error font-medium">{errors.ram.message}</p>
            )}
          </div>

          {/* Screen Refresh Rate */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
              Screen Refresh Rate <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <Gauge className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                {...register("refreshRate")}
                className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm text-foreground transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Refresh Rate</option>
                {REFRESH_RATE_OPTIONS.map((hz) => (
                  <option key={hz} value={hz}>
                    {hz} Display
                  </option>
                ))}
              </select>
            </div>
            {errors.refreshRate && (
              <p className="text-xs text-error font-medium">{errors.refreshRate.message}</p>
            )}
          </div>
        </div>

        {/* Chipset & DPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Chipset */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
              Chipset / Processor <span className="text-foreground-muted">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Snapdragon 7s Gen 2, Dimensity 8300 Ultra"
              {...register("chipset")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>

          {/* Device DPI */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
              Current Device DPI <span className="text-foreground-muted">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Default (392) or Custom DPI"
              {...register("deviceDpi")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Sensitivity Speed Preference */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Target Sensitivity Speed <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SENSI_PREFERENCES.map((pref) => (
              <label
                key={pref.id}
                className="relative flex flex-col p-3 rounded-xl bg-background-elevated border border-border hover:border-accent/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-bold text-xs text-foreground">
                    {pref.label}
                  </span>
                  <input
                    type="radio"
                    value={pref.id}
                    {...register("sensiPreference")}
                    className="accent-accent"
                  />
                </div>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {pref.description}
                </span>
              </label>
            ))}
          </div>
          {errors.sensiPreference && (
            <p className="text-xs text-error font-medium">{errors.sensiPreference.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

