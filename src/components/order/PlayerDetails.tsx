"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User, Gamepad2, MessageCircle, Send, Info } from "lucide-react";
import { OrderFormSchemaType } from "@/lib/validation";

interface PlayerDetailsProps {
  register: UseFormRegister<OrderFormSchemaType>;
  errors: FieldErrors<OrderFormSchemaType>;
}

export function PlayerDetails({ register, errors }: PlayerDetailsProps) {
  return (
    <div className="bg-background-card rounded-card border border-border p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 font-mono font-bold text-accent flex items-center justify-center text-sm">
          A
        </span>
        <div>
          <h2 className="font-heading font-bold text-lg md:text-xl text-foreground">
            PLAYER DETAILS
          </h2>
          <p className="text-xs text-foreground-muted">
            We&apos;ll use these details to deliver your sensitivity settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Full Name <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register("fullName")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-error font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Free Fire In-Game UID */}
        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Free Fire UID <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <Gamepad2 className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1928374650 (Numbers only)"
              {...register("gameId")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm font-mono text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>
          {errors.gameId ? (
            <p className="text-xs text-error font-medium">{errors.gameId.message}</p>
          ) : (
            <p className="text-[11px] text-foreground-muted">Your numeric game UID found in your profile</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            WhatsApp Number <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-foreground-muted font-mono text-xs">
              <MessageCircle className="w-4 h-4 text-success" />
              <span>+91</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              {...register("whatsappNumber")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-16 pr-4 py-2.5 text-sm font-mono text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>
          {errors.whatsappNumber ? (
            <p className="text-xs text-error font-medium">{errors.whatsappNumber.message}</p>
          ) : (
            <p className="text-[11px] text-foreground-muted">Sensitivity PDF sheet will be delivered here</p>
          )}
        </div>

        {/* Telegram Username (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Telegram Username <span className="text-foreground-muted">(Optional)</span>
          </label>
          <div className="relative">
            <Send className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="@username (optional)"
              {...register("telegramUsername")}
              className="w-full bg-background-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 transition-colors"
            />
          </div>
          {errors.telegramUsername && (
            <p className="text-xs text-error font-medium">{errors.telegramUsername.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-background-secondary text-xs text-foreground-muted border border-border/60">
        <Info className="w-4 h-4 text-accent shrink-0" />
        <span>
          Safety Notice: We will <strong>NEVER</strong> request your game password, OTP, or Facebook/Google login credentials.
        </span>
      </div>
    </div>
  );
}

