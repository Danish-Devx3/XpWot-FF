import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createPageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const image = {
    url: siteConfig.ogImage,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
