import type { Metadata } from "next";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getBestSellers, getCatalog } from "@/lib/products";
export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse published products across four departments.",
};
type SearchParams = Promise<{ q?: string; category?: string; subcategory?: string; sort?: string }>;
export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, catalog, categories, bestsellerRows] = await Promise.all([
    searchParams,
    getCatalog(),
    getCategories(),
    getBestSellers(50),
  ]);
  const sales = new Map(bestsellerRows.map((product) => [product.id, product.paid_units_sold ?? 0]));
  const products = catalog.products.map((product) => ({
    ...product,
    paid_units_sold: sales.get(product.id) ?? 0,
  }));
  const initialSort =
    params.sort === "popular" && bestsellerRows.length ? "popular" : params.sort || "featured";
  return (
    <div className="section-wrap page-section">
      <div className="page-intro shop-intro">
        <div>
          <span className="eyebrow">FASHION · COLLECTIBLES · SCHOOL · HOME</span>
          <h1>Shop all.</h1>
          <p>Search the current catalog by product, brand, keyword or department.</p>
        </div>
      </div>
      <ShopBrowser
        products={products}
        catalogState={catalog.state}
        categories={categories}
        initialCategory={params.category || "all"}
        initialSubcategory={params.subcategory || ""}
        initialQuery={params.q || ""}
        initialSort={initialSort}
      />
    </div>
  );
}
