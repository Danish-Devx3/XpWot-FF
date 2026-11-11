import React from "react";
import { PackageCheck, Smartphone, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Your Pack",
      desc: "Select the sensitivity package matching your requirements and competitive tier.",
      icon: PackageCheck,
      detail: "Basic, Pro, or Tournament Premium",
    },
    {
      num: "02",
      title: "Tell Us Your Device",
      desc: "Enter your smartphone specifications, RAM, screen refresh rate, and finger play style.",
      icon: Smartphone,
      detail: "Exact phone model & claw layout",
    },
    {
      num: "03",
      title: "Get Your Settings",
      desc: "Complete secure payment and receive your customized sensi directly through WhatsApp or Telegram.",
      icon: Send,
      detail: "Manual delivery with verification",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-heading font-semibold text-accent uppercase tracking-widest">
            Simple 3-Step Process
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-tight">
            THREE STEPS. <span className="text-accent">ONE BETTER SETUP.</span>
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base">
            Zero complicated downloads. No game credentials needed. Just calibrated numbers ready to plug into your game settings.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.num}
                hoverEffect
                className="p-8 border border-border bg-background-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-3xl font-black text-accent/50 group-hover:text-accent transition-colors">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-background-elevated border border-border flex items-center justify-center text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 text-xs font-mono text-accent/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{step.detail}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

