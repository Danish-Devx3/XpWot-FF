import React from "react";
import { Smartphone, CheckCircle, Cpu } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function DeviceCompatibility() {
  const brands = [
    { name: "Poco", popular: "X6 Pro, F6, F5, M6 Pro", badge: "High Touch Rate" },
    { name: "Redmi / Xiaomi", popular: "Note 13 Pro+, 12 Pro, 12 5G", badge: "MIUI / HyperOS" },
    { name: "Realme", popular: "12 Pro+, GT 6T, Narzo 70", badge: "Smooth Drag" },
    { name: "iQOO", popular: "Neo 9 Pro, Z9 5G, Neo 7", badge: "Esports Display" },
    { name: "OnePlus", popular: "12R, Nord 4, Nord CE 4", badge: "OxygenOS Fast" },
    { name: "Samsung", popular: "Galaxy S23/S24, A55, M34", badge: "OneUI Precision" },
    { name: "Vivo", popular: "T3 5G, V30 Pro, Y200", badge: "Funtouch Calibrated" },
    { name: "Motorola", popular: "Edge 50 Pro, G84, G54", badge: "Clean Android" },
    { name: "Oppo", popular: "Reno 11, F25 Pro, A79", badge: "ColorOS Optimized" },
    { name: "Other Android / iOS", popular: "Infinix, Tecno, Apple iPhone", badge: "Custom Calibrated" },
  ];

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="text-xs font-heading font-semibold text-accent uppercase tracking-widest">
            Hardware Matched
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-tight">
            MADE AROUND <span className="text-accent">YOUR DEVICE</span>
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base">
            Every smartphone has a distinct touch sampling rate, screen glass friction, and DPI scaling. We tailor settings specifically for your phone brand and chipset.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {brands.map((brand) => (
            <Card
              key={brand.name}
              hoverEffect
              className="p-5 border border-border bg-background-card flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-background-elevated border border-border flex items-center justify-center text-accent mb-4 group-hover:border-accent/40 group-hover:scale-105 transition-all">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground group-hover:text-white transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[11px] text-foreground-muted mt-1 line-clamp-2 leading-relaxed">
                  {brand.popular}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  {brand.badge}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Disclaimer note */}
        <div className="mt-8 text-center text-xs text-foreground-muted max-w-xl mx-auto">
          Supported device categories reflect tested smartphone architectures. Calibration formulas adjust according to your submitted model and RAM in the order form.
        </div>
      </div>
    </section>
  );
}

