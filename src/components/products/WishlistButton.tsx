"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/product";

export function WishlistButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { isSaved, toggle, verification } = useWishlist();
  const saved = isSaved(product.id);
  return (
    <button
      type="button"
      className={`wishlist-button ${compact ? "wishlist-button-compact" : ""} ${saved ? "is-saved" : ""}`}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={saved}
      disabled={verification !== "verified"}
      onClick={() => toggle(product)}
    >
      <Heart size={compact ? 18 : 20} fill={saved ? "currentColor" : "none"} />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
