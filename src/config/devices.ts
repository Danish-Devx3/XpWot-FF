export const POPULAR_DEVICES = [
  // Redmi / Poco / Xiaomi
  "Redmi Note 13 Pro+ 5G",
  "Redmi Note 12 Pro 5G",
  "Redmi Note 11",
  "Redmi Note 10 Pro Max",
  "Redmi 12 5G",
  "Redmi 13C 5G",
  "Poco X6 Pro 5G",
  "Poco X5 Pro",
  "Poco F6 5G",
  "Poco F5",
  "Poco M6 Pro 5G",
  "Xiaomi 14 / 13 Pro",

  // Realme
  "Realme 12 Pro+ 5G",
  "Realme 11 Pro 5G",
  "Realme Narzo 70 Pro",
  "Realme Narzo 60x",
  "Realme GT 6T / GT 2",
  "Realme C53 / C55",
  "Realme 9 Pro+ 5G",

  // Samsung
  "Samsung Galaxy S24 / S23 Ultra",
  "Samsung Galaxy S21 FE 5G",
  "Samsung Galaxy A55 5G",
  "Samsung Galaxy A35 5G",
  "Samsung Galaxy M34 / M35 5G",
  "Samsung Galaxy F54 5G",
  "Samsung Galaxy A15 5G",

  // iQOO & Vivo
  "iQOO Neo 9 Pro 5G",
  "iQOO Z9 / Z9x 5G",
  "iQOO 12 5G",
  "iQOO Neo 7 Pro",
  "Vivo T3 5G / T3x 5G",
  "Vivo V30 Pro / V29",
  "Vivo Y200 5G",

  // OnePlus
  "OnePlus 12 / 12R 5G",
  "OnePlus Nord 4 5G",
  "OnePlus Nord CE 4 5G",
  "OnePlus Nord CE 3 Lite",
  "OnePlus 11R",

  // Motorola
  "Moto Edge 50 Pro / Fusion",
  "Moto Edge 40 Neo",
  "Moto G84 5G",
  "Moto G64 5G",
  "Moto G54 5G",

  // Infinix & Tecno
  "Infinix GT 20 Pro",
  "Infinix Note 40 Pro",
  "Tecno Pova 6 Pro 5G",

  // Apple iPhone
  "iPhone 15 / 15 Pro Max",
  "iPhone 14 / 14 Pro",
  "iPhone 13 / 13 Pro",
  "iPhone 12 / 11",
];

export const RAM_OPTIONS = [
  "2GB",
  "3GB",
  "4GB",
  "6GB",
  "8GB",
  "12GB+",
] as const;

export const REFRESH_RATE_OPTIONS = [
  "60Hz",
  "90Hz",
  "120Hz",
  "144Hz",
] as const;

export const PLAY_STYLE_OPTIONS = [
  {
    id: "RUSHER",
    title: "RUSHER",
    description: "Close-range aggressive drag shots & quick 180° turns",
    icon: "Flame",
  },
  {
    id: "SNIPER",
    title: "SNIPER",
    description: "Long-range precision, steady scope control & quick-switch",
    icon: "Crosshair",
  },
  {
    id: "BALANCED",
    title: "BALANCED",
    description: "Adaptable mid-range, versatile drag & steady spray control",
    icon: "Shield",
  },
] as const;

export const FINGER_LAYOUT_OPTIONS = [
  { id: "2 Fingers", label: "2 Fingers (Thumbs)", description: "Standard thumb layout" },
  { id: "3 Fingers", label: "3 Fingers (Claw)", description: "Thumb + Index trigger" },
  { id: "4 Fingers", label: "4 Fingers (Full Claw)", description: "Two thumbs + Two triggers" },
  { id: "5 Fingers", label: "5+ Fingers", description: "Pro tournament claw setup" },
] as const;

export const SENSI_PREFERENCES = [
  { id: "HIGH", label: "High Sensitivity", description: "Fast flick, instant screen turns (requires high swipe control)" },
  { id: "BALANCED", label: "Balanced Sensitivity", description: "Optimal balance between smooth aim tracking & fast drag" },
  { id: "LOW", label: "Low Sensitivity", description: "Stable crosshair placement, zero shake (great for high DPI screens)" },
] as const;

