"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { WishlistButton } from "@/components/products/WishlistButton";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [simpleVariant, setSimpleVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { verification } = useCart();
  const optionKeys = useMemo(
    () => [...new Set(product.variants.flatMap((variant) => Object.keys(variant.options)))],
    [product.variants],
  );
  const selectedVariant: ProductVariant | null = optionKeys.length
    ? (product.variants.find((variant) =>
        optionKeys.every((key) => options[key] && variant.options[key] === options[key]),
      ) ?? null)
    : product.variants.length
      ? (product.variants.find((variant) => variant.id === simpleVariant) ?? null)
      : null;
  const baseAvailable = product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
  const selectedPrice = selectedVariant?.price_ngn ?? product.price_ngn;
  const comparePrice =
    selectedVariant?.price_ngn === null || selectedVariant?.price_ngn === undefined
      ? product.compare_at_price_ngn
      : null;
  const stock = selectedVariant?.stock_quantity ?? (product.variants.length ? null : product.stock_quantity);
  const onSale = comparePrice !== null && comparePrice > selectedPrice;
  const maxQuantity = stock === null ? 0 : Math.min(20, stock);
  const canChooseQuantity = product.variants.length === 0 || selectedVariant !== null;
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id, stock]);

  return (
    <div className="purchase-panel">
      <div className="detail-price">
        <strong>{formatPrice(selectedPrice, product.currency_code)}</strong>
        {onSale && comparePrice !== null && <del>{formatPrice(comparePrice, product.currency_code)}</del>}
      </div>
      {onSale && comparePrice !== null && (
        <p className="sale-explanation">Current published price compared with the store's original price.</p>
      )}
      {product.variants.length > 0 &&
        (optionKeys.length ? (
          optionKeys.map((key) => {
            const values = [
              ...new Set(product.variants.map((variant) => variant.options[key]).filter(Boolean)),
            ];
            const label = key.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
            return (
              <label className="form-field variant-field" key={key}>
                <span>{label}</span>
                <select
                  value={options[key] ?? ""}
                  onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.value }))}
                >
                  <option value="">Choose {label.toLowerCase()}</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            );
          })
        ) : (
          <label className="form-field variant-field">
            <span>Option</span>
            <select value={simpleVariant} onChange={(event) => setSimpleVariant(event.target.value)}>
              <option value="">Choose an option</option>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={variant.stock_quantity <= 0}>
                  {variant.label}
                  {variant.stock_quantity <= 0 ? " · unavailable" : ""}
                </option>
              ))}
            </select>
          </label>
        ))}
      <p className={`availability ${stock === 0 || !baseAvailable ? "availability-out" : ""}`} role="status">
        {!baseAvailable
          ? "Currently unavailable"
          : selectedVariant
            ? stock === 0
              ? "This option is unavailable"
              : `${stock} available`
            : product.variants.length
              ? "Availability varies by option"
              : `${product.stock_quantity} available`}
      </p>
      {canChooseQuantity && (
        <div className="quantity-picker" aria-label="Quantity">
          <span>Quantity</span>
          <div>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus size={15} />
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQuantity || maxQuantity === 0}
              onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      )}
      <div className="purchase-actions">
        {product.variants.length > 0 && !selectedVariant ? (
          <button type="button" className="button button-dark add-button" disabled>
            <ShoppingBag size={16} /> Choose an option
          </button>
        ) : (
          <AddToCartButton product={product} selectedVariant={selectedVariant} quantity={quantity} />
        )}
        <button
          type="button"
          className="button button-outline buy-now-button"
          disabled
          aria-describedby="checkout-unavailable-note"
        >
          Buy now · unavailable
        </button>
      </div>
      <WishlistButton product={product} />
      <p className="purchase-note" id="checkout-unavailable-note">
        Checkout is not open yet. Your bag can be saved, but the store cannot accept or confirm an order until
        verified payments and order handling are connected.
      </p>
      <div className="delivery-note">
        <strong>Delivery & returns</strong>
        <p>
          Delivery coverage, charges, timing and return terms have not been confirmed. See{" "}
          <Link href="/shipping">shipping information</Link> and{" "}
          <Link href="/returns">returns information</Link>.
        </p>
      </div>
    </div>
  );
}
