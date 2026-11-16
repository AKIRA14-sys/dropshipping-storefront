import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { CatalogState } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";

export function Hero({
  products,
  categories,
  catalogState,
  spotlightLabel,
}: {
  products: Product[];
  categories: Category[];
  catalogState: CatalogState;
  spotlightLabel: string;
}) {
  return (
    <section className="app-home-hero section-wrap" aria-labelledby="home-hero-title">
      <div className="home-hero-banner">
        <div className="home-hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> YOUR NEXT FIND STARTS HERE
          </span>
          <h1 id="home-hero-title">Find your next favourite.</h1>
          <p>Explore departments, browse current listings and discover what fits your everyday.</p>
          <div className="home-hero-actions">
            <Link className="button button-dark" href="/explore">
              Explore the shop <ArrowRight size={16} />
            </Link>
            <Link className="home-hero-secondary" href="#departments">
              Browse departments <ArrowUpRight size={15} />
            </Link>
          </div>
          {categories.length > 0 && (
            <span className="home-hero-count">{categories.length} departments to explore</span>
          )}
        </div>
        {categories.length > 0 && (
          <div className="home-hero-art" aria-label="Explore departments">
            {categories.slice(0, 3).map((category, index) => (
              <Link
                className={`home-hero-category home-hero-category-${index + 1}`}
                href={`/categories/${category.slug}`}
                key={category.slug}
                aria-label={`Explore ${category.name}`}
              >
                <CategoryArtwork category={category} sizes="(max-width: 760px) 42vw, 20vw" />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="home-spotlight-panel">
        <div className="home-spotlight-heading">
          <div>
            <span className="eyebrow">{products.length ? spotlightLabel : "LIVE CATALOG"}</span>
            <h2>{products.length ? "Worth a closer look" : "Product listings, when they’re ready"}</h2>
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
