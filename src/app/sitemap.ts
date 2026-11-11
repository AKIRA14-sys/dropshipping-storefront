import type { MetadataRoute } from "next";
import { canIndexSite } from "@/config/store";
import { STORE_CATEGORIES } from "@/data/categories";
import { getSiteUrl } from "@/lib/supabase/client";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!canIndexSite()) return [];
  const base = getSiteUrl();
  const products = await getProducts();
  const staticPaths = [
    "",
    "/shop",
    "/new-arrivals",
    "/offers",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    ...STORE_CATEGORIES.map((category) => `/categories/${category.slug}`),
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
      lastModified: new Date(product.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
