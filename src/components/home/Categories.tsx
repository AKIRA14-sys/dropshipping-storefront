import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { CatalogState } from "@/lib/products";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";

export function Categories({
  categories,
  products = [],
  catalogState = "ready",
  variant = "default",
}: {
  categories: Category[];
  products?: Product[];
  catalogState?: CatalogState;
  variant?: "default" | "home-tiles";
}) {
  if (!categories.length) return null;
  const isHomeTiles = variant === "home-tiles";
  return (
    <section
      className="category-discovery section-wrap"
      id="departments"
      aria-labelledby="department-heading"
    >
      <div className="section-heading app-section-heading">
        <div>
          <span className="eyebrow">{categories.length} DEPARTMENTS TO EXPLORE</span>
          <h2 id="department-heading">Browse by department.</h2>
        </div>
        <Link href="/explore" className="text-link">
          Explore all <ArrowRight size={15} />
        </Link>
      </div>
      <div
        className={`category-discovery-grid${isHomeTiles ? " home-category-tiles" : ""}`}
        aria-label="Store departments"
      >
        {categories.map((category) => {
          const count = products.filter((product) => product.category_slug === category.slug).length;
          const countLabel =
            catalogState === "not-configured"
              ? "Catalog not connected"
              : catalogState === "unavailable"
                ? "Catalog unavailable"
                : count
                  ? `${count} listed`
                  : "No listings yet";
          return (
            <Link
              href={`/categories/${category.slug}`}
              className={`department-card${isHomeTiles ? " home-department-tile" : ""}`}
              key={category.slug}
              aria-label={`${category.name}, ${countLabel}`}
            >
              <CategoryArtwork
                category={category}
                sizes={isHomeTiles ? "(max-width: 760px) 22vw, 12vw" : "(max-width: 700px) 46vw, 22vw"}
                className={isHomeTiles ? "home-department-artwork" : ""}
              />
              <div className={`department-card-copy${isHomeTiles ? " home-department-tile-copy" : ""}`}>
                {isHomeTiles ? (
                  <h3>{category.name}</h3>
                ) : (
                  <>
                    <span className="department-card-count">{countLabel}</span>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </>
                )}
              </div>
              {!isHomeTiles && (
                <span className="department-card-arrow" aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
