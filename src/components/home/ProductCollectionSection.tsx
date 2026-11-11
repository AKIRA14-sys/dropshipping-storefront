import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";

export function ProductCollectionSection({
  title,
  eyebrow,
  products,
  href,
  linkLabel,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  href: string;
  linkLabel: string;
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
      <ProductGrid products={products} />
    </section>
  );
}
