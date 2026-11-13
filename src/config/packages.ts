export interface SensiPackage {
  id: PackageId;
  name: string;
  tagline: string;
  price: number; // in INR
  originalPrice: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  deliveryEstimate: string;
}

export const PACKAGE_IDS = ["premium"] as const;
export type PackageId = typeof PACKAGE_IDS[number];

export const SENSI_PACKAGES: Record<PackageId, SensiPackage> = {
  premium: {
    id: "premium",
    name: "PREMIUM PACK",
    tagline: "One premium sensitivity pack, customized for your Android phone",
    price: 349,
    originalPrice: 500,
    badge: "ALL ANDROID DEVICES",
    isPopular: true,
    features: [
      "Customized for your Android phone model, RAM & refresh rate",
      "Complete sensitivity settings for all scopes",
      "Personalized to your play style and finger layout",
      "DPI recommendations for smoother control",
      "Delivery within 2 - 4 hours",
      "WhatsApp re-tuning support within 7 days",
      "No game password required"
    ],
    deliveryEstimate: "2 - 4 Hours",
  },
};

export function getPackageById(id: string): SensiPackage | null {
  return id === "premium" ? SENSI_PACKAGES.premium : null;
}
