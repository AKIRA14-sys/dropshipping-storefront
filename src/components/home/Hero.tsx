import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/product";
import type { CatalogState } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";

export function Hero({
  products,
  catalogState,
  spotlightLabel,
}: {
  products: Product[];
  catalogState: CatalogState;
  spotlightLabel: string;
}) {
  return (
    <section className="app-home-hero section-wrap" aria-labelledby="home-hero-title">
      <div className="app-home-hero-heading">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} /> GOOD FINDS, LIVE AND CURRENT
          </span>
          <h1 id="home-hero-title">Find your next favourite.</h1>
          <p>Explore the latest published finds across the shop.</p>
        </div>
        <Link className="button button-dark" href="/explore">
          Explore the shop <ArrowRight size={16} />
        </Link>
      </div>
      <div className="home-spotlight-panel">
        <div className="home-spotlight-heading">
          <div>
            <span className="eyebrow">{products.length ? spotlightLabel : "LIVE CATALOG"}</span>
            <h2>{products.length ? "Worth a closer look" : "Product spotlights are on their way"}</h2>
          </div>
          {products.length > 0 && (
            <span className="spotlight-live-indicator">
              <i /> Published now
            </span>
          )}
        </div>
        {products.length ? (
          <ProductGrid products={products.slice(0, 8)} className="spotlight-rail" />
        ) : (
          <CatalogEmptyState state={catalogState} compact />
        )}
      </div>
    </section>
  );
}
