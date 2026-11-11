"use client";

import Link from "next/link";
import { ArrowRight, Heart, RefreshCw, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ProductGrid } from "@/components/products/ProductGrid";

export function CartExperience({ activeView }: { activeView: "bag" | "saved" }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const {
    items,
    currencySubtotals,
    setQuantity,
    removeItem,
    verification,
    syncError,
    removedCount,
    adjustedCount,
  } = cart;
  const savedView = activeView === "saved";
  const selectedVerification = savedView ? wishlist.verification : verification;
  const viewHref = (view: "bag" | "saved") => `/cart${view === "saved" ? "?view=saved" : ""}`;

  return (
    <section className="section-wrap cart-page app-cart-page">
      <div className="app-page-title-row">
        <div>
          <span className="eyebrow">YOUR SHOPPING SPACE</span>
          <h1>{savedView ? "Saved for later." : "Your cart."}</h1>
          <p>Keep everything you’re considering together.</p>
        </div>
        <Link className="button button-outline app-back-to-shop" href="/explore">
          Keep exploring <ArrowRight size={15} />
        </Link>
      </div>

      <nav className="cart-view-switch" aria-label="Cart sections">
        <Link href={viewHref("bag")} aria-current={!savedView ? "page" : undefined}>
          <ShoppingBag size={17} /> Your cart <span>{cart.itemCount}</span>
        </Link>
        <Link href={viewHref("saved")} aria-current={savedView ? "page" : undefined}>
          <Heart size={17} /> Wishlist <span>{wishlist.count}</span>
        </Link>
      </nav>

      {selectedVerification === "checking" && (
        <div className="cart-loading" role="status">
          <span className="loader-ring" /> Checking saved items against current inventory…
        </div>
      )}

      {selectedVerification === "unavailable" && (
        <div className="catalog-empty app-empty-panel" role="alert">
          <div>
            <h2>We couldn’t verify saved items just now.</h2>
            <p>
              Your saved product IDs are still kept on this device. Refresh when the live catalog is
              available; old prices and stock details stay hidden until then.
            </p>
          </div>
          <button className="button button-outline" type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      {selectedVerification === "not-configured" && (
        <div className="catalog-empty app-empty-panel">
          <div>
            <h2>The live catalog isn’t connected yet.</h2>
            <p>
              We can’t verify product prices or stock until the store database is configured. Saved product
              details stay hidden rather than showing old or guessed information.
            </p>
          </div>
          <Link className="button button-outline" href="/explore">
            Browse departments <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {selectedVerification === "verified" && !savedView && !items.length && (
        <div className="empty-cart app-empty-panel">
          <span className="empty-cart-mark">
            <ShoppingBag size={29} />
          </span>
          <h2>Your cart is empty.</h2>
          <p>Explore the live catalog and add a product to your cart. Guest carts stay on this device.</p>
          <Link href="/explore" className="button button-dark">
            Explore the shop <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {selectedVerification === "verified" && savedView && !wishlist.items.length && (
        <div className="empty-cart app-empty-panel">
          <span className="empty-cart-mark">
            <Heart size={27} />
          </span>
          <h2>Your wishlist is waiting.</h2>
          <p>Tap the heart on any published product to save it here.</p>
          <Link href="/explore" className="button button-dark">
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {selectedVerification === "verified" && !savedView && items.length > 0 && (
        <>
          {syncError && (
            <p className="catalog-notice" role="status">
              Your cart is saved on this device; account sync will resume when available.
            </p>
          )}
          {removedCount > 0 && (
            <p className="catalog-notice" role="status">
              {removedCount} unavailable product{removedCount === 1 ? " was" : "s were"} removed from your
              cart.
            </p>
          )}
          {adjustedCount > 0 && (
            <p className="catalog-notice" role="status">
              Some quantities were adjusted to match current stock.
            </p>
          )}
          <p className="cart-item-count">
            {items.reduce((sum, line) => sum + line.quantity, 0)} item(s), checked against the current
            catalog.
          </p>
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
            </div>
            <CartSummary currencySubtotals={currencySubtotals} />
          </div>
        </>
      )}

      {selectedVerification === "verified" && savedView && wishlist.items.length > 0 && (
        <>
          {wishlist.syncError && (
            <p className="catalog-notice" role="status">
              Your wishlist is saved on this device; account sync will resume when available.
            </p>
          )}
          {wishlist.removedCount > 0 && (
            <p className="catalog-notice" role="status">
              {wishlist.removedCount} unavailable saved product
              {wishlist.removedCount === 1 ? " was" : "s were"} removed.
            </p>
          )}
          <p className="cart-item-count">
            {wishlist.items.length} saved item{wishlist.items.length === 1 ? "" : "s"}.
          </p>
          <ProductGrid products={wishlist.items} className="saved-product-grid" />
        </>
      )}
    </section>
  );
}
