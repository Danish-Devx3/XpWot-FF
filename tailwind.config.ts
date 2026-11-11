import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#08090B",
          secondary: "#101216",
          card: "#15181E",
          elevated: "#1C2028",
        },
        accent: {
          DEFAULT: "#FF6B24",
          secondary: "#FF9B45",
          glow: "rgba(255, 107, 36, 0.15)",
        },
        foreground: {
          DEFAULT: "#F5F5F5",
          muted: "#969BA5",
        },
        border: "#292E38",
        success: "#22C55E",
        error: "#EF4444",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
        input: "10px",
      },
      boxShadow: {
        "glow-orange": "0 0 25px -5px rgba(255, 107, 36, 0.3)",
        "glow-orange-lg": "0 0 40px -5px rgba(255, 107, 36, 0.45)",
        "card-soft": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at center, rgba(255, 107, 36, 0.12) 0%, transparent 70%)",
        "cyber-grid": "linear-gradient(to right, #1f232b 1px, transparent 1px), linear-gradient(to bottom, #1f232b 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
