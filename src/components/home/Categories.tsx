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
}: {
  categories: Category[];
  products?: Product[];
  catalogState?: CatalogState;
}) {
  if (!categories.length) return null;
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
      <div className="category-discovery-rail" aria-label="Store departments">
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
              className="department-card"
              key={category.slug}
              aria-label={`${category.name}, ${countLabel}`}
            >
              <CategoryArtwork category={category} />
              <div className="department-card-copy">
                <span className="department-card-count">{countLabel}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <span className="department-card-arrow" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
