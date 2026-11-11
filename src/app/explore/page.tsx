import type { Metadata } from "next";
import { Search, Sparkles } from "lucide-react";
import { Categories } from "@/components/home/Categories";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getBestSellers, getCatalog } from "@/lib/products";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore departments and search the current published catalog.",
};
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; subcategory?: string; sort?: string }>;
export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const [params, catalog, categories, bestSellers] = await Promise.all([
    searchParams,
    getCatalog(),
    getCategories(),
    getBestSellers(50),
  ]);
  const sales = new Map(bestSellers.map((product) => [product.id, product.paid_units_sold ?? 0]));
  const products = catalog.products.map((product) => ({
    ...product,
    paid_units_sold: sales.get(product.id) ?? 0,
  }));
  return (
    <div className="explore-page">
      <header className="explore-hero section-wrap">
        <span className="eyebrow">
          <Sparkles size={14} /> EXPLORE THE STORE
        </span>
        <h1>Discover what’s next.</h1>
        <p>
          Search live listings or browse departments. Product details are shown only when published by the
          store.
        </p>
        <form className="explore-search" action="/search" role="search">
          <Search size={20} aria-hidden="true" />
          <input
            name="q"
            type="search"
            defaultValue={params.q || ""}
            placeholder="Search products, brands or keywords"
            aria-label="Search products, brands or keywords"
          />
          <button type="submit">Search</button>
        </form>
        <div className="explore-quick-links" aria-label="Quick browse">
          <a href="#departments">Browse departments</a>
          <a href="#current-listings">Current listings</a>
          <a href="/new-arrivals">New arrivals</a>
          <a href="/offers">Offers</a>
        </div>
      </header>
      <Categories categories={categories} products={catalog.products} catalogState={catalog.state} />
      <section id="current-listings" className="section-wrap explore-listings">
        <div className="section-heading app-section-heading">
          <div>
            <span className="eyebrow">CURRENTLY PUBLISHED</span>
            <h2>Shop all listings.</h2>
          </div>
        </div>
        <ShopBrowser
          products={products}
          catalogState={catalog.state}
          categories={categories}
          initialCategory={params.category || "all"}
          initialSubcategory={params.subcategory || ""}
          initialQuery={params.q || ""}
          initialSort={params.sort || "featured"}
        />
      </section>
    </div>
  );
}
