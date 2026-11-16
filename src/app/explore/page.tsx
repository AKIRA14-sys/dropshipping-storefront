import type { Metadata } from "next";
import { Suspense } from "react";
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

type ExploreParams = { q?: string; category?: string; subcategory?: string; sort?: string };
type SearchParams = Promise<ExploreParams>;

function ExploreHero({ query }: { query: string }) {
  return (
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
          defaultValue={query}
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
  );
}

async function ExploreResults({ params }: { params: ExploreParams }) {
  const [catalog, categories, bestSellers] = await Promise.all([
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
    <>
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
    </>
  );
}

function ExploreResultsLoading() {
  return (
    <div className="section-wrap explore-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="explore-loading-ring" aria-hidden="true" />
      <span>Loading live listings and departments…</span>
    </div>
  );
}

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <div className="explore-page">
      <ExploreHero query={params.q || ""} />
      <Suspense fallback={<ExploreResultsLoading />}>
        <ExploreResults params={params} />
      </Suspense>
    </div>
  );
}
