import type { Metadata } from "next";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };
type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  const query = params.q?.trim() || "";
  return (
    <div className="section-wrap page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">A GOOD FIND IS A SEARCH AWAY</span>
          <h1>Search the shop.</h1>
          <p>{query ? `Looking for “${query}”.` : "Search products or browse by department."}</p>
        </div>
      </div>
      <ShopBrowser products={products} categories={categories} initialQuery={query} />
    </div>
  );
}
