"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Sliders,
  Smartphone,
  Crosshair,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  const [hudValues, setHudValues] = useState<{ [key: string]: number }>({
    General: 98,
    "Red Dot": 94,
    "2x Scope": 89,
    "4x Scope": 84,
    "Sniper Scope": 56,
    "Free Look": 72,
  });

  const handleSliderChange = (label: string, value: number) => {
    setHudValues((prev) => ({ ...prev, [label]: value }));
  };
  return (
    <section className="relative overflow-hidden bg-grid-pattern pb-16 pt-10 md:pb-24 md:pt-16">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Headline & Action */}
          <div className="space-y-6 text-center md:space-y-7 lg:col-span-7 lg:text-left">
            {/* Badge */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center lg:justify-start"
            >
              <Badge variant="orange" size="md" className="gap-2 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>BUILT FOR YOUR DEVICE</span>
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              YOUR AIM. <br />
              YOUR DEVICE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-secondary to-accent drop-shadow-[0_0_30px_rgba(255,107,36,0.35)]">
                YOUR ADVANTAGE.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Start with a free sensitivity profile based on your phone and play style. No game login needed—just a clearer starting point for your setup.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row lg:justify-start"
            >
              <Link href="#finder" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-heading text-base shadow-glow-orange-lg sm:w-auto"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  TRY THE FREE FINDER
                </Button>
              </Link>
              <Link href="#packs" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-heading text-base sm:w-auto"
                  rightIcon={<Zap className="h-4 w-4" />}
                >
                  VIEW PREMIUM PACK
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-xs text-foreground-muted lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" />
                No game password or OTP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Crosshair className="h-4 w-4 text-accent" />
                Free starting profile
              </span>
            </motion.div>
          </div>

          {/* Right Column: Esports Smartphone Mockup & HUD Configuration */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-[360px] sm:max-w-[400px]"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 -m-6 bg-gradient-to-r from-accent/20 to-accent-secondary/10 rounded-3xl blur-2xl -z-10" />

              {/* Smartphone Frame */}
              <div className="bg-background-secondary rounded-[32px] p-3 sm:p-4 border-2 border-border shadow-2xl relative">
                {/* Smartphone Speaker & Camera Notch */}
                <div className="w-24 h-4 bg-background rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="w-8 h-1 rounded-full bg-border" />
                </div>

                {/* Smartphone Screen Content: Esports HUD */}
                <div className="relative space-y-4 overflow-hidden rounded-[24px] border border-border/80 bg-background p-5">
                  {/* Top HUD Header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-[11px] font-mono font-semibold tracking-wider text-accent">
                        SAMPLE PROFILE
                      </span>
                    </div>
                    <span className="rounded border border-border bg-background-elevated px-2 py-0.5 text-[10px] font-mono text-foreground-muted">
                      EXAMPLE
                    </span>
                  </div>

                  {/* Active Profile Info */}
                  <div className="p-3 rounded-xl bg-background-elevated/70 border border-border flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-foreground-muted uppercase font-heading">
                        Example phone
                      </div>
                      <div className="text-xs font-heading font-bold text-foreground">
                        Poco X6 Pro / Redmi Note 13
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-foreground-muted uppercase font-heading">
                        Layout
                      </div>
                      <div className="text-xs font-mono font-bold text-accent">
                        4-Finger Claw
                      </div>
                    </div>
                  </div>

                  {/* Sensitivity Calibration Values (Interactive In-Game Sliders Simulation) */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      { label: "General", color: "accent" },
                      { label: "Red Dot", color: "accent" },
                      { label: "2x Scope", color: "accent" },
                      { label: "4x Scope", color: "accent" },
                      { label: "Sniper Scope", color: "accent-secondary" },
                      { label: "Free Look", color: "accent-secondary" },
                    ].map((item) => {
                      const currentVal = hudValues[item.label] ?? 80;
                      return (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-foreground-muted">{item.label}</span>
                            <span className="text-accent font-bold">{currentVal}</span>
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={currentVal}
                              onChange={(e) => handleSliderChange(item.label, Number(e.target.value))}
                              aria-label={`${item.label} sample sensitivity`}
                              className="w-full h-1.5 bg-background-elevated rounded-full appearance-none cursor-pointer accent-accent"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DPI / Touch Response Footnote */}
                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-foreground-muted border-t border-border/50">
                    <span>Example DPI: 411</span>
                    <span>Device-specific tuning</span>
                  </div>
                </div>
              </div>

              {/* Floating HUD Badge 1: DEVICE OPTIMIZED */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 sm:-left-8 bg-background-card/95 backdrop-blur-md border border-accent/40 rounded-xl p-3 shadow-glow-orange flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-accent font-bold tracking-wider">
                    DEVICE MATCHED
                  </div>
                  <div className="text-xs text-foreground font-heading font-medium">
                    Tuned to your phone
                  </div>
                </div>
              </motion.div>

              {/* Floating HUD Badge 2: CUSTOM SETTINGS */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-background-card/95 backdrop-blur-md border border-accent/40 rounded-xl p-3 shadow-glow-orange flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-accent font-bold tracking-wider">
                    PLAY STYLE
                  </div>
                  <div className="text-xs text-foreground font-heading font-medium">
                    Built around your grip
                  </div>
                </div>
              </motion.div>

              {/* Floating HUD Badge 3: PLAYER PROFILE */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 -right-8 hidden sm:flex bg-background-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 shadow-card-soft items-center gap-2 text-[10px] font-mono text-foreground-muted"
              >
                <Crosshair className="w-3.5 h-3.5 text-accent" />
                <span>PLAYER PROFILE: RUSHER</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
