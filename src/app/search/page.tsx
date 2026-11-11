import type { Metadata } from "next";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getBestSellers, getCatalog } from "@/lib/products";
export const metadata: Metadata = { title: "Search products", robots: { index: false, follow: true } };
type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, catalog, categories, bestsellerRows] = await Promise.all([
    searchParams,
    getCatalog(),
    getCategories(),
    getBestSellers(50),
  ]);
  const query = params.q?.trim() || "";
  const sales = new Map(bestsellerRows.map((product) => [product.id, product.paid_units_sold ?? 0]));
  const products = catalog.products.map((product) => ({
    ...product,
    paid_units_sold: sales.get(product.id) ?? 0,
  }));
  const initialSort =
    params.sort === "popular" && bestsellerRows.length ? "popular" : params.sort || "featured";
  return (
    <div className="section-wrap page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">SEARCH THE CURRENT CATALOG</span>
          <h1>Find what you’re looking for.</h1>
          <p>
            {query
              ? `Results for “${query}” across published products, brands and keywords.`
              : "Search products, brands, keywords or browse a department."}
          </p>
        </div>
      </div>
      <ShopBrowser
        products={products}
        catalogState={catalog.state}
        categories={categories}
        initialCategory={params.category || "all"}
        initialQuery={query}
        initialSort={initialSort}
      />
    </div>
  );
}
