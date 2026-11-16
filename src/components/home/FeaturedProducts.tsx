import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="featured-section app-product-section">
      <div className="section-wrap">
        <div className="section-heading app-section-heading">
          <div>
            <span className="eyebrow">SELECTED BY THE STORE</span>
            <h2>Featured finds.</h2>
          </div>
          <Link href="/explore" className="text-link">
            View all products <ArrowUpRight size={15} />
          </Link>
        </div>
        <HomeProductCarousel ariaLabel="Featured products">
          <ProductGrid
            products={products}
            className="app-product-grid home-carousel-product-grid"
            showPurchaseAction={false}
          />
        </HomeProductCarousel>
      </div>
    </section>
  );
}
