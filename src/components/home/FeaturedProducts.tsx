import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="featured-section">
      <div className="section-wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD THINGS, CURRENTLY</span>
            <h2>A few favourites.</h2>
          </div>
          <Link href="/shop" className="text-link">
            View all finds <ArrowUpRight size={15} />
          </Link>
        </div>
        <ProductGrid products={products} className="featured-grid" />
      </div>
    </section>
  );
}
