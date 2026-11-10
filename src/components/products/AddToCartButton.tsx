"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className={`button button-dark add-button ${compact ? "button-compact" : ""}`}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      aria-label={`Add ${product.name} to bag`}
    >
      {added ? (
        <>
          <Check size={16} /> Added to bag
        </>
      ) : (
        <>
          <ShoppingBag size={16} /> Add to bag
        </>
      )}
    </button>
  );
}
