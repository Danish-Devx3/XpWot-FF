import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  return [
    {
      url: baseUrl,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/order`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      priority: 0.5,
    },
  ];
}
