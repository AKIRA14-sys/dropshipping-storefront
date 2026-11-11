import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import type { CatalogState } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";

export function FeaturedProducts({
  products,
  catalogState,
}: {
  products: Product[];
  catalogState: CatalogState;
}) {
  return (
    <section className="featured-section">
      <div className="section-wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PUBLISHED BY THE STORE</span>
            <h2>Featured finds.</h2>
          </div>
          <Link href="/shop" className="text-link">
            View all products <ArrowUpRight size={15} />
          </Link>
        </div>
        {products.length ? (
          <ProductGrid products={products} className="featured-grid" />
        ) : (
          <CatalogEmptyState state={catalogState} compact />
        )}
      </div>
    </section>
  );
}
