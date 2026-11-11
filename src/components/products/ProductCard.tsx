import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { WishlistButton } from "@/components/products/WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const comparePrice = product.variants.length === 0 ? product.compare_at_price_ngn : null;
  const onSale = comparePrice !== null && comparePrice > product.price_ngn;
  const discount = onSale ? Math.round((1 - product.price_ngn / comparePrice) * 100) : 0;
  const available = product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
  const variantPrices = product.variants.map((variant) => variant.price_ngn ?? product.price_ngn);
  const displayPrice = product.variants.length ? Math.min(...variantPrices) : product.price_ngn;
  const secondaryImage = product.images.find((image) => image.image_url !== product.image_url);
  return (
    <article className="product-card">
      <Link
        className="product-image-link"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <div className="product-image-wrap">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder" aria-label="Product image unavailable" />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.image_url}
              alt={secondaryImage.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
              className="product-image product-image-secondary"
            />
          )}
          {onSale && <span className="sale-badge">{discount}% off</span>}
          {!available && <span className="stock-badge">Out of stock</span>}
          <span className="image-arrow">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
      <WishlistButton product={product} compact />
      <div className="product-card-copy">
        <span className="product-category">
          {product.category_name}
          {product.subcategory_name ? ` · ${product.subcategory_name}` : ""}
        </span>
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <Link href={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="price-row">
          <strong>
            {product.variants.length ? "From " : ""}
            {formatPrice(displayPrice, product.currency_code)}
          </strong>
          {onSale && <del>{formatPrice(comparePrice, product.currency_code)}</del>}
        </div>
        {product.variants.length ? (
          <Link href={`/products/${product.slug}`} className="button button-outline product-options-link">
            Choose options <ArrowUpRight size={14} />
          </Link>
        ) : (
          <AddToCartButton product={product} compact />
        )}
      </div>
    </article>
  );
}
