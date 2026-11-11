import { STORE_CATEGORIES, getStaticCategory, isCategorySlug } from "@/data/categories";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, CategorySlug } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return STORE_CATEGORIES;
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, display_order, subcategories(id, slug, name, display_order)")
    .eq("active", true)
    .order("display_order");
  if (error || !data) return STORE_CATEGORIES;

  const liveBySlug = new Map<string, Category>();
  for (const row of data) {
    const base = getStaticCategory(row.slug);
    if (!base || !isCategorySlug(row.slug)) continue;
    liveBySlug.set(row.slug, {
      ...base,
      id: row.id,
      name: row.name,
      description: row.description || base.description,
      display_order: row.display_order ?? base.display_order,
      subcategories: Array.isArray(row.subcategories)
        ? row.subcategories.map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            display_order: item.display_order ?? 0,
          }))
        : base.subcategories,
    });
  }
  return STORE_CATEGORIES.map((category) => liveBySlug.get(category.slug) ?? category);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return isCategorySlug(slug) ? getStaticCategory(slug) : undefined;
}

export function isValidCategorySlug(value: string): value is CategorySlug {
  return isCategorySlug(value);
}
