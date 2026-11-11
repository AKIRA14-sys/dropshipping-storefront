import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { linePrice } from "@/lib/cart-utils";

export function CartItem({
  line,
  onChangeQuantity,
  onRemove,
}: {
  line: CartLine;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const { product, quantity, variantLabel } = line;
  const price = linePrice(line);
  return (
    <article className="cart-row">
      <Link href={`/products/${product.slug}`} className="cart-thumb">
        {product.image_url && <Image src={product.image_url} alt={product.name} fill sizes="100px" />}
      </Link>
      <div>
        <span className="cart-product-meta">{product.category_name}</span>
        <Link href={`/products/${product.slug}`} className="cart-product-title">
          {product.name}
        </Link>
        {variantLabel && <span className="cart-variant-label">Option: {variantLabel}</span>}
        <div className="cart-unit-price">{formatPrice(price, product.currency_code)}</div>
        <div className="cart-controls">
          <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onChangeQuantity(quantity - 1)}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onChangeQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button type="button" className="remove-button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
      <div className="line-total">{formatPrice(price * quantity, product.currency_code)}</div>
    </article>
  );
}
