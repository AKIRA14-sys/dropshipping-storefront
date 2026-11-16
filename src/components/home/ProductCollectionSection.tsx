import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";

export function ProductCollectionSection({
  title,
  eyebrow,
  products,
  href,
  linkLabel,
  variant = "grid",
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  href: string;
  linkLabel: string;
  variant?: "grid" | "carousel";
}) {
  if (!products.length) return null;
  return (
    <section className="collection-section section-wrap">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link href={href} className="text-link">
          {linkLabel} <ArrowUpRight size={15} />
        </Link>
      </div>
      {variant === "carousel" ? (
        <HomeProductCarousel ariaLabel={title.replace(/[.]+$/, "") + " products"}>
          <ProductGrid
            products={products}
            className="home-carousel-product-grid"
            showPurchaseAction={false}
          />
        </HomeProductCarousel>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
