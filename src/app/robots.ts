import type { MetadataRoute } from "next";
import { canIndexSite } from "@/config/store";
import { getSiteUrl } from "@/lib/supabase/client";

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = canIndexSite();
  if (!indexingEnabled) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/account",
        "/cart",
        "/checkout",
        "/login",
        "/signup",
        "/wishlist",
        "/forgot-password",
        "/reset-password",
        "/search",
        "/track",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
