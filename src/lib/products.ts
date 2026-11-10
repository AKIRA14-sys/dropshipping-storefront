import { DEMO_PRODUCTS } from "@/data/demo-products";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return DEMO_PRODUCTS;
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, price_ngn, compare_at_price_ngn, image_url, featured, stock_quantity, categories(slug, name)",
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data?.length) return process.env.NEXT_PUBLIC_STORE_LIVE === "true" ? [] : DEMO_PRODUCTS;
  return data.map((row) => {
    const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      price_ngn: Number(row.price_ngn),
      compare_at_price_ngn: row.compare_at_price_ngn === null ? null : Number(row.compare_at_price_ngn),
      category_slug: (category?.slug ?? "beauty") as Product["category_slug"],
      category_name: category?.name ?? "Shop",
      image_url: row.image_url ?? "/images/skincare-hero.jpg",
      featured: row.featured,
      stock_quantity: row.stock_quantity,
    };
  }) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export function isUsingDemoCatalog(): boolean {
  return process.env.NEXT_PUBLIC_STORE_LIVE !== "true" || !isBackendConfigured();
}

export function isBackendConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
