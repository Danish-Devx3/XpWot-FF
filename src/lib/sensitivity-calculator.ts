import { z } from "zod";
import { getRecommendedDpi } from "./dpi-calculator";

export const sensitivityRequestSchema = z.object({
  deviceName: z.string().trim().min(2).max(80),
  ram: z
    .string()
    .trim()
    .max(20)
    .regex(/^\d+(?:\.\d+)?\s*(?:GB)?\+?$/i, "Enter RAM as a positive amount, such as 8 GB")
    .refine((value) => Number.parseFloat(value) > 0 && Number.parseFloat(value) <= 128),
  dpi: z.number().int().min(50).max(2000).nullable(),
  fingerStyle: z.enum(["2 fingers", "3 fingers", "4 fingers", "5 fingers"]),
  playStyle: z.enum(["Rusher", "Sniper", "Balanced"]),
});

export type SensitivityRequest = z.infer<typeof sensitivityRequestSchema>;

export const sensitivityResultSchema = z.object({
  isExactMatch: z.boolean(),
  versionName: z.string(),
  device: z.object({
    name: z.string(),
    brandName: z.string(),
    slug: z.string(),
    ram: z.string(),
    dpi: z.number().nullable(),
    refreshRate: z.number().nullable(),
    chipset: z.string().nullable(),
  }),
  preferences: z.object({
    game: z.enum(["Free Fire MAX", "Free Fire", "Free Fire India"]),
    fingerStyle: z.enum(["2 fingers", "3 fingers", "4 fingers", "5 fingers"]),
    playStyle: z.enum(["Rusher", "Sniper", "Balanced"]),
  }),
  sensitivity: z.object({
    general: z.number().nullable(),
    redDot: z.number(),
    scope2x: z.number(),
    scope4x: z.number(),
    sniperScope: z.number(),
    freeLook: z.number(),
    recommendedDpi: z.number().nullable(),
    fireButtonSize: z.number(),
    fireButtonPosition: z.string(),
    fireButtonHorizontal: z.number(),
    fireButtonVertical: z.number(),
  }),
  matchNotice: z.string(),
  dpiNotice: z.string(),
  premiumSlug: z.string(),
});

export type SensitivityResult = z.infer<typeof sensitivityResultSchema>;

const highRamGeneralBaseline: Record<string, number> = {
  "4": 192,
  "6": 183,
  "8": 175,
};

const styleProfiles = {
  Rusher: { redDot: 190, scope2x: 160, scope4x: 140, sniperScope: 99, freeLook: 170 },
  Sniper: { redDot: 162, scope2x: 160, scope4x: 150, sniperScope: 99, freeLook: 155 },
  Balanced: { redDot: 176, scope2x: 150, scope4x: 135, sniperScope: 99, freeLook: 160 },
} as const;

const fingerAdjustments = {
  "2 fingers": { redDot: 4, scope2x: -4, scope4x: -5, freeLook: 2 },
  "3 fingers": { redDot: 2, scope2x: 0, scope4x: 0, freeLook: 1 },
  "4 fingers": { redDot: 0, scope2x: 4, scope4x: 5, freeLook: 0 },
  "5 fingers": { redDot: -2, scope2x: 6, scope4x: 8, freeLook: -2 },
} as const;

const fireButtonSizes = {
  Rusher: { "2 fingers": 44, "3 fingers": 42, "4 fingers": 40, "5 fingers": 38 },
  Sniper: { "2 fingers": 40, "3 fingers": 38, "4 fingers": 36, "5 fingers": 34 },
  Balanced: { "2 fingers": 42, "3 fingers": 40, "4 fingers": 38, "5 fingers": 36 },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function getGeneralSensitivity(ram: string): number | null {
  const parsedRam = ram.trim().match(/^(\d+(?:\.\d+)?)\s*(?:GB)?\+?$/i)?.[1];
  if (!parsedRam) return null;

  const amount = Number(parsedRam);
  if (amount >= 12) return 168;
  return highRamGeneralBaseline[parsedRam] ?? null;
}

function inferBrand(deviceName: string): string {
  const prefixes: Array<[string, string]> = [
    ["samsung", "Samsung"],
    ["redmi", "Redmi"],
    ["xiaomi", "Xiaomi"],
    ["realme", "Realme"],
    ["iqoo", "iQOO"],
    ["poco", "Poco"],
    ["oneplus", "OnePlus"],
    ["vivo", "Vivo"],
    ["oppo", "Oppo"],
    ["moto", "Motorola"],
    ["motorola", "Motorola"],
    ["infinix", "Infinix"],
    ["tecno", "Tecno"],
    ["iphone", "Apple"],
  ];
  const normalized = deviceName.trim().toLowerCase();
  return prefixes.find(([prefix]) => normalized.startsWith(prefix))?.[1] ?? "Other";
}

export function calculateSensitivity(request: SensitivityRequest) {
  const style = styleProfiles[request.playStyle];
  const finger = fingerAdjustments[request.fingerStyle];
  const general = getGeneralSensitivity(request.ram);
  const recommendedDpi = getRecommendedDpi(request.ram, request.dpi ?? NaN);
  const slug = request.deviceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    isExactMatch: false,
    versionName: "rules-v2",
    device: {
      name: request.deviceName,
      brandName: inferBrand(request.deviceName),
      slug,
      ram: request.ram,
      dpi: request.dpi,
      refreshRate: null,
      chipset: null,
    },
    preferences: {
      game: "Free Fire MAX" as const,
      fingerStyle: request.fingerStyle,
      playStyle: request.playStyle,
    },
    sensitivity: {
      general,
      redDot: clamp(style.redDot + finger.redDot, 154, 196),
      scope2x: clamp(style.scope2x + finger.scope2x, 100, 180),
      scope4x: clamp(style.scope4x + finger.scope4x, 80, 170),
      sniperScope: 99,
      freeLook: clamp(style.freeLook + finger.freeLook, 0, 199),
      recommendedDpi,
      fireButtonSize: fireButtonSizes[request.playStyle][request.fingerStyle],
      fireButtonPosition: "Lower right",
      fireButtonHorizontal: 88,
      fireButtonVertical: 78,
    },
    matchNotice:
      "Rule-based starting values only; not verified device-specific settings or scientifically validated recommendations. Only General sensitivity uses RAM. Other sensitivity values use play style and finger count.",
    dpiNotice: recommendedDpi
      ? "Exact verified RAM/DPI reference (base DPI 360)."
      : "No verified DPI reference is available for this RAM and current DPI combination.",
    premiumSlug: slug,
  };
}
