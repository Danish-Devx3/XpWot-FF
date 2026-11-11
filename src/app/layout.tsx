import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "XPWOT — Premium Free Fire Sensitivity Store | Precision Meets Performance",
    template: "%s | XPWOT Esports Sensitivity",
  },
  description:
    "Get customized Free Fire and Free Fire MAX sensitivity settings tailored to your smartphone model, RAM, refresh rate, and finger play style. Stop guessing, play with precision.",
  keywords: [
    "Free Fire sensitivity",
    "Free Fire MAX sensi settings",
    "Poco X6 Pro Free Fire sensitivity",
    "Redmi Note 13 sensitivity settings",
    "Realme 12 Free Fire sensitivity",
    "Free Fire headshot sensitivity India",
    "custom Free Fire DPI settings",
    "4 finger claw sensitivity Free Fire",
    "XPWOT sensi store",
  ],
  authors: [{ name: "XPWOT" }],
  creator: "XPWOT",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: "XPWOT — Precision Meets Performance | Custom Free Fire Sensitivity",
    description:
      "Stop guessing your sensitivity. Get custom Free Fire settings calibrated specifically for your smartphone hardware and play style.",
    siteName: "XPWOT",
  },
  twitter: {
    card: "summary_large_image",
    title: "XPWOT — Custom Free Fire Sensitivity Store",
    description:
      "Settings tailored to your exact smartphone, RAM, and claw layout. Instant manual delivery via WhatsApp & Telegram.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans bg-background text-foreground min-h-screen flex flex-col selection:bg-accent selection:text-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#15181E",
              border: "1px solid #292E38",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  );
}
