import React from "react";
import { Cpu, ShieldCheck, UserCheck } from "lucide-react";

export function TrustStrip() {
  const indicators = [
    {
      title: "DEVICE-BASED SETTINGS",
      description: "Tuned specifically for your phone's processor, RAM & touch response",
      icon: Cpu,
    },
    {
      title: "SECURE PAYMENT",
      description: "Secure checkout powered by ZapUPI",
      icon: ShieldCheck,
    },
    {
      title: "HUMAN-ASSISTED DELIVERY",
      description: "Direct manual delivery and verified settings sent straight to WhatsApp / Telegram",
      icon: UserCheck,
    },
  ];

  return (
    <section className="relative border-y border-border bg-background-secondary/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
          {indicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-4 ${idx > 0 ? "pt-6 md:pt-0 md:pl-8" : ""}`}
              >
                <div className="w-11 h-11 rounded-xl bg-background-elevated border border-border flex items-center justify-center text-accent shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
