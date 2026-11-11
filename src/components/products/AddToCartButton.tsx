"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/types/product";

export function AddToCartButton({
  product,
  compact = false,
  selectedVariant = null,
  quantity = 1,
}: {
  product: Product;
  compact?: boolean;
  selectedVariant?: ProductVariant | null;
  quantity?: number;
}) {
  const { addItem, verification } = useCart();
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const available = selectedVariant
    ? selectedVariant.stock_quantity
    : product.variants.length
      ? Math.max(...product.variants.map((variant) => variant.stock_quantity), 0)
      : product.stock_quantity;
  const variantRequired = product.variants.length > 0 && !selectedVariant && available > 0;
  if (variantRequired)
    return (
      <Link
        href={`/products/${product.slug}`}
        className={`button button-outline add-button ${compact ? "button-compact" : ""}`}
      >
        Choose options <ArrowRight size={15} />
      </Link>
    );
  const disabled = pending || verification !== "verified" || available <= 0;
  const label =
    available <= 0
      ? "Out of stock"
      : verification === "checking" || pending
        ? "Checking availability…"
        : verification !== "verified"
          ? "Availability unavailable"
          : "Add to bag";
  async function handleAdd() {
    if (disabled) return;
    setPending(true);
    setFeedback("");
    const safeQuantity = Math.max(1, Math.min(Math.floor(quantity), available));
    const success = await addItem(product, safeQuantity, selectedVariant);
    setAdded(success);
    setFeedback(
      success
        ? `${product.name} added to your bag.`
        : `${product.name} or the selected option is no longer available. The bag was not updated.`,
    );
    if (success) window.setTimeout(() => setAdded(false), 1500);
    setPending(false);
  }
  return (
    <>
      <button
        className={`button button-dark add-button ${compact ? "button-compact" : ""}`}
        type="button"
        disabled={disabled}
        onClick={() => void handleAdd()}
        aria-label={added ? `${product.name} added to bag` : `${label}: ${product.name}`}
      >
        {added ? (
          <>
            <Check size={16} /> Added
          </>
        ) : available <= 0 ? (
          label
        ) : verification === "verified" && !pending ? (
          <>
            <ShoppingBag size={16} /> Add to bag
          </>
        ) : (
          label
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {feedback}
      </span>
    </>
  );
}
