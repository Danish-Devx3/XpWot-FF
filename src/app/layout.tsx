import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "Free Fire Sensitivity Settings for Your Phone | XPWOT",
    template: "%s | XPWOT",
  },
  description:
    "Find a Free Fire sensitivity starting profile for your phone and play style, or get custom settings tuned to your device. No game login required.",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Free Fire Sensitivity Settings for Your Phone | XPWOT",
    description:
      "Find a Free Fire sensitivity starting profile for your phone and play style, or get custom settings tuned to your device.",
    siteName: "XPWOT",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "XPWOT — device-specific Free Fire sensitivity settings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fire Sensitivity Settings for Your Phone | XPWOT",
    description:
      "Find a Free Fire sensitivity starting profile for your phone and play style, or get custom settings tuned to your device.",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
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
