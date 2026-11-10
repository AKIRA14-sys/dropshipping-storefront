import { CATEGORIES } from "@/data/demo-products";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, CategorySlug } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return CATEGORIES;
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .order("display_order");
  if (error || !data?.length) return process.env.NEXT_PUBLIC_STORE_LIVE === "true" ? [] : CATEGORIES;
  return data as Category[];
}

export function getDemoCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((category) => category.slug === value);
}
