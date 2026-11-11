import { cache } from "react";
import { STORE_CATEGORIES, getStaticCategory, isCategorySlug } from "@/data/categories";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category, CategorySlug } from "@/types/category";

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return isSupabaseConfigured() ? [] : STORE_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, name, description, image_url, display_order, subcategories(id, slug, name, display_order)",
    )
    .eq("active", true)
    .eq("subcategories.active", true)
    .order("display_order");
  if (error || !data) {
    if (error) console.error("Live category query failed", error.code || "unknown");
    return [];
  }

  return data
    .filter((row) => isCategorySlug(row.slug))
    .map((row) => {
      const presentation = getStaticCategory(row.slug);
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description || "Browse this department.",
        image_url: row.image_url || presentation?.image_url || null,
        icon_key: presentation?.icon_key || "grid",
        display_order: row.display_order ?? 0,
        subcategories: Array.isArray(row.subcategories)
          ? row.subcategories.map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              display_order: item.display_order ?? 0,
            }))
          : [],
      };
    })
    .sort((a, b) => a.display_order - b.display_order);
});

export function getCategoryBySlug(slug: string): Category | undefined {
  return isCategorySlug(slug) ? getStaticCategory(slug) : undefined;
}

export function isValidCategorySlug(value: string): value is CategorySlug {
  return isCategorySlug(value);
}
