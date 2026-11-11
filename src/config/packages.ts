export interface SensiPackage {
  id: "basic" | "pro" | "premium";
  name: string;
  tagline: string;
  price: number; // in INR
  originalPrice: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  deliveryEstimate: string;
}

export const SENSI_PACKAGES: Record<"basic" | "pro" | "premium", SensiPackage> = {
  basic: {
    id: "basic",
    name: "BASIC PACK",
    tagline: "Essential device calibration for casual & beginner players",
    price: 299,
    originalPrice: 499,
    features: [
      "Standard customized sensitivity (General & Red Dot)",
      "RAM & screen size basic calibration",
      "Optimized for your selected finger layout",
      "Delivery within 12 - 24 hours",
      "Standard WhatsApp delivery",
      "No game password required"
    ],
    deliveryEstimate: "12 - 24 Hours",
  },
  pro: {
    id: "pro",
    name: "PRO PACK",
    tagline: "Advanced precision tuning for competitive ranked players",
    price: 599,
    originalPrice: 999,
    badge: "MOST POPULAR",
    isPopular: true,
    features: [
      "Advanced customized sensitivity (All scopes + Free Look)",
      "Device model, RAM & refresh-rate consideration",
      "Play-style customization (Rusher / Sniper / Balanced)",
      "Device DPI recommendations for smooth drag",
      "Priority human-assisted delivery",
      "Dedicated WhatsApp support",
      "No game password required"
    ],
    deliveryEstimate: "4 - 8 Hours",
  },
  premium: {
    id: "premium",
    name: "PREMIUM PACK",
    tagline: "Tournament-grade setup with 1-on-1 sensitivity fine-tuning",
    price: 999,
    originalPrice: 1599,
    badge: "MAX PERFORMANCE",
    features: [
      "Tournament-grade custom sensitivity matrix",
      "Full device chipset, RAM & 120Hz/144Hz calibration",
      "Custom finger layout HUD tips (2, 3, 4 or 5 fingers)",
      "Express priority delivery (2 - 4 hours)",
      "1-on-1 WhatsApp re-tuning support within 7 days",
      "VIP Telegram delivery channel",
      "No game password required"
    ],
    deliveryEstimate: "2 - 4 Hours",
  },
};

export const PACKAGE_IDS = ["basic", "pro", "premium"] as const;
export type PackageId = typeof PACKAGE_IDS[number];

export function getPackageById(id: string): SensiPackage | null {
  if (id === "basic" || id === "pro" || id === "premium") {
    return SENSI_PACKAGES[id];
  }
  return null;
}

