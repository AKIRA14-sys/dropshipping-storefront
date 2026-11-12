import Link from "next/link";
import { ArrowUpRight, ImageOff } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { WishlistButton } from "@/components/products/WishlistButton";
import { ProductCardImage } from "@/components/products/ProductCardImage";

export function ProductCard({ product }: { product: Product }) {
  const comparePrice = product.variants.length === 0 ? product.compare_at_price_ngn : null;
  const onSale = comparePrice !== null && comparePrice > product.price_ngn;
  const discount = onSale ? Math.round((1 - product.price_ngn / comparePrice) * 100) : 0;
  const available = product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
  const variantPrices = product.variants.map((variant) => variant.price_ngn ?? product.price_ngn);
  const displayPrice = product.variants.length ? Math.min(...variantPrices) : product.price_ngn;
  const secondaryImage = product.images[1];
  const primaryImageUrl = product.card_image_url || product.image_url;
  return (
    <article className="product-card">
      <Link
        className="product-image-link"
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <div className="product-image-wrap">
          {primaryImageUrl ? (
            <ProductCardImage
              src={primaryImageUrl}
              fallbackSrc={product.card_image_url ? product.image_url : undefined}
              alt={product.name}
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder" role="img" aria-label="No product image available">
              <ImageOff size={30} aria-hidden="true" />
              <span>Image coming soon</span>
            </div>
          )}
          {secondaryImage && (
            <ProductCardImage
              src={secondaryImage.card_image_url || secondaryImage.image_url}
              fallbackSrc={secondaryImage.card_image_url ? secondaryImage.image_url : undefined}
              alt={secondaryImage.alt_text || product.name}
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
