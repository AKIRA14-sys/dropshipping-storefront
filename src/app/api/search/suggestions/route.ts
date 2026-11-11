import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) return NextResponse.json({ suggestions: [] });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ suggestions: [] });
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,brand,categories(name)")
    .eq("active", true)
    .textSearch("search_document", query, { type: "websearch", config: "simple" })
    .limit(6);
  if (error || !data) return NextResponse.json({ suggestions: [] });
  const suggestions = data.map((row) => {
    const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    return {
      label: row.name,
      subline: [row.brand, category?.name].filter(Boolean).join(" · "),
      href: `/products/${row.slug}`,
      kind: "product" as const,
    };
  });
  return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "private, max-age=15" } });
}
