import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) return NextResponse.json({ suggestions: [] });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ suggestions: [] });

  const [productResult, categoryResult] = await Promise.all([
    supabase
      .from("products")
      .select("slug,name,brand,categories(name)")
      .eq("active", true)
      .textSearch("search_document", query, { type: "websearch", config: "simple" })
      .limit(6),
    supabase
      .from("categories")
      .select("slug,name,description,subcategories(slug,name)")
      .eq("active", true)
      .eq("subcategories.active", true)
      .order("display_order")
      .limit(100),
  ]);

  const suggestions: { label: string; subline: string; href: string; kind: string }[] = [];
  for (const row of productResult.data || []) {
    const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    suggestions.push({
      label: row.name,
      subline: [row.brand, category?.name].filter(Boolean).join(" · ") || "Product",
      href: `/products/${row.slug}`,
      kind: "product",
    });
  }

  const needle = query.toLocaleLowerCase();
  for (const category of categoryResult.data || []) {
    const categoryMatch = `${category.name} ${category.description || ""}`
      .toLocaleLowerCase()
      .includes(needle);
    if (categoryMatch) {
      suggestions.push({
        label: category.name,
        subline: "Department",
        href: `/categories/${category.slug}`,
        kind: "category",
      });
    }
    for (const subcategory of Array.isArray(category.subcategories) ? category.subcategories : []) {
      if (subcategory.name.toLocaleLowerCase().includes(needle)) {
        suggestions.push({
          label: subcategory.name,
          subline: category.name,
          href: `/categories/${category.slug}?subcategory=${encodeURIComponent(subcategory.slug)}`,
          kind: "subcategory",
        });
      }
    }
  }

  return NextResponse.json(
    { suggestions: suggestions.slice(0, 8) },
    { headers: { "Cache-Control": "private, max-age=15" } },
  );
}
