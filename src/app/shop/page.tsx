import type { Metadata } from "next";
import { ShopBrowser } from "@/components/products/ProductFilters";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse the AKIRA STORE catalogue across beauty, fashion, electronics and home.",
};
type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  return (
    <div className="section-wrap page-section">
      <div className="page-intro shop-intro">
        <div>
          <span className="eyebrow">THE WHOLE GOOD-FIND EDIT</span>
          <h1>
            Shop all <span className="heading-spark">✳</span>
          </h1>
          <p>Little picks across beauty, style, tech and home.</p>
        </div>
        <div className="intro-note">
          <span className="demo-dot" /> Sample catalogue <span>Prices are illustrative only</span>
        </div>
      </div>
      <ShopBrowser
        products={products}
        categories={categories}
        initialCategory={params.category || "all"}
        initialQuery={params.q || ""}
      />
    </div>
  );
}
