import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";
import { ProductGrid } from "@/components/products/ProductGrid";

export function DepartmentSpotlight({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const available = categories.filter((category) =>
    products.some((product) => product.category_slug === category.slug),
  );
  if (!available.length) return null;
  const category = available[Math.floor(Date.now() / 86_400_000) % available.length];
  const selection = products.filter((product) => product.category_slug === category.slug).slice(0, 4);
  return (
    <section className="department-feature section-wrap">
      <div className="department-feature-top">
        <div className="department-feature-art">
          <CategoryArtwork category={category} />
        </div>
        <div className="department-feature-copy">
          <span className="eyebrow">DEPARTMENT SPOTLIGHT</span>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          <Link className="button button-outline" href={`/categories/${category.slug}`}>
            Browse department <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <ProductGrid products={selection} className="department-feature-grid" />
    </section>
  );
}
