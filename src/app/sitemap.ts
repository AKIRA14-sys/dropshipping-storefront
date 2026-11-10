import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/supabase/client";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_INDEXING_ENABLED !== "true") return [];
  const base = getSiteUrl();
  const products = await getProducts();
  const staticPaths = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/policies",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/categories/beauty",
    "/categories/fashion",
    "/categories/electronics",
    "/categories/home-living",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
