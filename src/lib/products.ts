import { cache } from "react";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isCategorySlug } from "@/data/categories";
import type { Product, ProductImage, ProductVariant } from "@/types/product";

export type CatalogState = "not-configured" | "unavailable" | "empty" | "ready";
export interface CatalogResult {
  state: CatalogState;
  products: Product[];
}

const PRODUCT_SELECT =
  "id, category_id, subcategory_id, slug, name, description, brand, price_ngn, compare_at_price_ngn, currency_code, image_url, stock_quantity, featured, is_new_arrival, active, attributes, search_terms, created_at, categories!inner(slug,name,active), subcategories(slug,name,active), product_images(id,image_url,alt_text,sort_order), product_variants(id,label,sku,options,price_ngn,stock_quantity,active)";

function firstRelation<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

export function mapProduct(row: Record<string, any>): Product | null {
  const category = firstRelation(row.categories);
  if (
    !category ||
    category.active !== true ||
    typeof category.slug !== "string" ||
    !isCategorySlug(category.slug)
  )
    return null;
  const rawImages = Array.isArray(row.product_images) ? row.product_images : [];
  const images: ProductImage[] = rawImages
    .filter((image: any) => typeof image.image_url === "string" && image.image_url.length > 0)
    .map((image: any) => ({
      id: String(image.id),
      image_url: image.image_url,
      alt_text: image.alt_text || row.name,
      sort_order: Number(image.sort_order ?? 0),
    }))
    .sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order);
  const imageUrl = row.image_url || images[0]?.image_url || null;
  const primaryImage = imageUrl
    ? images.find((image) => image.image_url === imageUrl) ?? {
        id: `primary-${row.id}`,
        image_url: imageUrl,
        alt_text: row.name,
        sort_order: 0,
      }
    : null;
  const displayImages = primaryImage
    ? [primaryImage, ...images.filter((image) => image.image_url !== imageUrl)]
    : [];
  const rawSubcategory = firstRelation(row.subcategories);
  const subcategory = rawSubcategory?.active === true ? rawSubcategory : undefined;
  const variants: ProductVariant[] = (Array.isArray(row.product_variants) ? row.product_variants : [])
    .filter((variant: any) => variant.active === true)
    .map((variant: any) => ({
      id: String(variant.id),
      label: variant.label,
      sku: variant.sku ?? null,
      options: variant.options ?? {},
      price_ngn:
        variant.price_ngn === null || variant.price_ngn === undefined ? null : Number(variant.price_ngn),
      stock_quantity: Number(variant.stock_quantity ?? 0),
    }));
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    brand: row.brand ?? null,
    price_ngn: Number(row.price_ngn),
    compare_at_price_ngn:
      row.compare_at_price_ngn === null || row.compare_at_price_ngn === undefined
        ? null
        : Number(row.compare_at_price_ngn),
    currency_code: String(row.currency_code || "NGN").toUpperCase(),
    category_id: String(row.category_id),
    category_slug: category.slug,
    category_name: category.name || "",
    subcategory_id: row.subcategory_id ? String(row.subcategory_id) : null,
    subcategory_slug: subcategory?.slug ?? null,
    subcategory_name: subcategory?.name ?? null,
    image_url: imageUrl,
    images: displayImages,
    variants,
    attributes: row.attributes && typeof row.attributes === "object" ? row.attributes : {},
    search_terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    featured: row.featured === true,
    is_new_arrival: row.is_new_arrival === true,
    stock_quantity: Number(row.stock_quantity ?? 0),
    created_at: row.created_at,
  };
}

async function queryProducts(ids?: string[]): Promise<{ products: Product[]; failed: boolean }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { products: [], failed: !isSupabaseConfigured() };
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true);
  if (ids) query = query.in("id", ids);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(ids ? ids.length : 300);
  if (error || !data) {
    if (error) console.error("Live catalog query failed", error.code || "unknown");
    return { products: [], failed: true };
  }
  const products = data
    .map((row) => mapProduct(row as Record<string, any>))
    .filter((row): row is Product => Boolean(row));
  return { products, failed: false };
}

export const getCatalog = cache(async (): Promise<CatalogResult> => {
  if (!isSupabaseConfigured()) return { state: "not-configured", products: [] };
  const result = await queryProducts();
  if (result.failed) return { state: "unavailable", products: [] };
  return { state: result.products.length ? "ready" : "empty", products: result.products };
});

export async function getProducts(): Promise<Product[]> {
  return (await getCatalog()).products;
}

export async function getProductsByIds(ids: string[]): Promise<Product[] | null> {
  if (!isSupabaseConfigured()) return null;
  const uniqueIds = Array.from(new Set(ids)).slice(0, 100);
  if (!uniqueIds.length) return [];
  const result = await queryProducts(uniqueIds);
  return result.failed ? null : result.products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 24): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.is_new_arrival).slice(0, limit);
}

export async function getPromotions() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("store_promotions")
    .select("id,title,description,image_url,cta_label,cta_url,starts_at,ends_at")
    .eq("active", true)
    .order("display_order");
  if (error || !data) return [];
  return data.filter(
    (item) => (!item.starts_at || item.starts_at <= now) && (!item.ends_at || item.ends_at >= now),
  );
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_public_bestseller_counts", { p_limit: limit });
  if (error || !data?.length) return [];
  const sales = new Map<string, number>(
    data.map((item: { product_id: string; paid_units: number }) => [
      item.product_id,
      Number(item.paid_units),
    ]),
  );
  const products = await getProducts();
  return products
    .filter((product) => sales.has(product.id))
    .map((product) => ({ ...product, paid_units_sold: sales.get(product.id) }))
    .sort((a, b) => (b.paid_units_sold ?? 0) - (a.paid_units_sold ?? 0))
    .slice(0, limit);
}
