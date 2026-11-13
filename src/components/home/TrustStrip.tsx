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
    <section className="relative border-y border-border bg-background-secondary/45 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-background-card/70 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-7">
          {indicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3.5 py-5 md:py-5 ${idx > 0 ? "md:pl-6 lg:pl-8" : ""} ${idx < indicators.length - 1 ? "md:pr-6 lg:pr-8" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-xs font-bold tracking-[0.12em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-foreground-muted">
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
