import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/supabase/client";

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";
  if (!indexingEnabled) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/cart", "/order/", "/track"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
