import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { formatNaira } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_price_ngn
    ? Math.max(1, Math.round((1 - product.price_ngn / product.compare_at_price_ngn) * 100))
    : null;
  return (
    <article className="product-card">
      <Link
        className="product-image-link"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <div className="product-image-wrap">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
            className="product-image"
          />
          {discount && <span className="sale-badge">-{discount}%</span>}
          <span className="image-arrow">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
      <div className="product-card-copy">
        <span className="product-category">{product.category_name}</span>
        <Link href={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="price-row">
          <strong>{formatNaira(product.price_ngn)}</strong>
          {product.compare_at_price_ngn && <del>{formatNaira(product.compare_at_price_ngn)}</del>}
        </div>
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}
