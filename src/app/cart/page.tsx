"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const {
    items,
    currencySubtotals,
    setQuantity,
    removeItem,
    verification,
    syncError,
    removedCount,
    adjustedCount,
  } = useCart();
  if (verification === "checking")
    return (
      <section className="section-wrap cart-page">
        <p role="status">Checking your bag against current inventory…</p>
      </section>
    );
  if (verification === "unavailable")
    return (
      <section className="section-wrap cart-page">
        <span className="eyebrow">YOUR BAG</span>
        <h1>Saved items are temporarily hidden.</h1>
        <div className="catalog-empty" role="alert">
          <div>
            <h2>We couldn't verify prices or stock.</h2>
            <p>
              Your product IDs are still saved on this device. Refresh when the live catalog is available;
              outdated prices won't be shown.
            </p>
          </div>
          <button className="button button-outline" type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      </section>
    );
  if (!items.length)
    return (
      <section className="section-wrap cart-page">
        <div className="empty-cart">
          <span className="empty-cart-mark">
            <ShoppingBag size={29} />
          </span>
          <h2>Your bag is empty.</h2>
          <p>
            Browse the live catalog and add a product to your bag. Your guest bag is saved on this device.
          </p>
          <Link href="/shop" className="button button-dark">
            Explore departments <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  return (
    <section className="section-wrap cart-page">
      <span className="eyebrow">YOUR BAG</span>
      <h1>Your saved picks.</h1>
      <p>
        {items.reduce((sum, line) => sum + line.quantity, 0)} item(s), verified against the current catalog.
      </p>
      {syncError && (
        <p className="catalog-notice" role="status">
          Your bag is saved on this device; account sync will resume when available.
        </p>
      )}
      {removedCount > 0 && (
        <p className="catalog-notice" role="status">
          {removedCount} item{removedCount === 1 ? " was" : "s were"} removed because it is no longer
          available.
        </p>
      )}
      {adjustedCount > 0 && (
        <p className="catalog-notice" role="status">
          Some quantities were adjusted to match current stock.
        </p>
      )}
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((line) => (
            <CartItem
              key={`${line.product.id}:${line.variantKey}`}
              line={line}
              onChangeQuantity={(next) => setQuantity(line.product.id, next, line.variantId)}
              onRemove={() => removeItem(line.product.id, line.variantId)}
            />
          ))}
          <Link href="/shop" className="continue-shopping">
            ← Keep browsing
          </Link>
        </div>
        <CartSummary currencySubtotals={currencySubtotals} />
      </div>
    </section>
  );
}
