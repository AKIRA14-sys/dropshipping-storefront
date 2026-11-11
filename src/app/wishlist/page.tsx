"use client";

import Link from "next/link";
import { ArrowRight, Heart, RefreshCw } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductGrid } from "@/components/products/ProductGrid";

export default function WishlistPage() {
  const { items, verification, syncError, removedCount } = useWishlist();
  if (verification === "checking")
    return (
      <section className="section-wrap wishlist-page">
        <p role="status">Checking your saved items…</p>
      </section>
    );
  if (verification === "unavailable")
    return (
      <section className="section-wrap wishlist-page">
        <span className="eyebrow">YOUR WISHLIST</span>
        <h1>Saved for later.</h1>
        <div className="catalog-empty" role="alert">
          <Heart size={22} />
          <div>
            <h2>We couldn't refresh your saved products.</h2>
            <p>
              Your saved IDs are kept on this device. Refresh this page when the live catalog is available; no
              old prices are shown.
            </p>
          </div>
          <button className="button button-outline" type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      </section>
    );
  return (
    <section className="section-wrap wishlist-page">
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR WISHLIST</span>
          <h1>Saved for later.</h1>
          <p>
            {items.length
              ? `${items.length} saved item${items.length === 1 ? "" : "s"}.`
              : "Save products you would like to revisit."}
          </p>
        </div>
      </div>
      {syncError && (
        <p className="form-error" role="status">
          Your wishlist is saved on this device, but account sync is temporarily unavailable.
        </p>
      )}
      {removedCount > 0 && (
        <p className="catalog-notice" role="status">
          {removedCount} saved product{removedCount === 1 ? " was" : "s were"} no longer available and{" "}
          {removedCount === 1 ? "has" : "have"} been removed.
        </p>
      )}
      {items.length ? (
        <ProductGrid products={items} />
      ) : (
        <div className="account-empty">
          <span className="catalog-empty-icon">
            <Heart size={24} />
          </span>
          <h2>No saved products yet.</h2>
          <p>Tap the heart on a product to add it to your wishlist.</p>
          <Link className="button button-dark" href="/shop">
            Browse the catalog <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}
