import React from "react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pricing } from "@/components/home/Pricing";
import { DeviceCompatibility } from "@/components/home/DeviceCompatibility";
import { ProofSection } from "@/components/home/ProofSection";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Pricing />
      <DeviceCompatibility />
      <ProofSection />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

