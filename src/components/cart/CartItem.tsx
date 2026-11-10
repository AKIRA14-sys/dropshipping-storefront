import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatNaira } from "@/lib/utils";

export function CartItem({
  product,
  quantity,
  onChangeQuantity,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <article className="cart-row">
      <Link href={`/products/${product.slug}`} className="cart-thumb">
        <Image src={product.image_url} alt={product.name} fill sizes="100px" />
      </Link>
      <div>
        <span className="cart-product-meta">{product.category_name}</span>
        <Link href={`/products/${product.slug}`} className="cart-product-title">
          {product.name}
        </Link>
        <div className="cart-unit-price">{formatNaira(product.price_ngn)}</div>
        <div className="cart-controls">
          <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
            <button aria-label="Decrease quantity" onClick={() => onChangeQuantity(quantity - 1)}>
              −
            </button>
            <span>{quantity}</span>
            <button aria-label="Increase quantity" onClick={() => onChangeQuantity(quantity + 1)}>
              +
            </button>
          </div>
          <button className="remove-button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
      <div className="line-total">{formatNaira(product.price_ngn * quantity)}</div>
    </article>
  );
}
