"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Navigation } from "@/components/layout/Navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { StoreLogo } from "@/components/layout/Logo";
import { HeaderSearch } from "@/components/layout/HeaderSearch";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return (
    <header className="site-header">
      <div className="header-main">
        <MobileMenu open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
        <StoreLogo />
        <HeaderSearch />
        <div className="header-actions">
          <Link
            className="header-action-link"
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} saved items`}
          >
            <Heart size={20} strokeWidth={1.8} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <b className="bag-count">{wishlistCount}</b>}
          </Link>
          <Link
            className="header-action-link"
            href={user ? "/account" : "/login"}
            aria-label={user ? "Your account" : "Sign in to your account"}
          >
            <UserRound size={20} strokeWidth={1.8} />
            <span>{user ? "Account" : "Sign in"}</span>
          </Link>
          <Link className="bag-link" href="/cart" aria-label={`Shopping bag, ${itemCount} items`}>
            <ShoppingBag size={21} strokeWidth={1.8} />
            <span>Bag</span>
            {itemCount > 0 && <b className="bag-count">{itemCount}</b>}
          </Link>
        </div>
      </div>
      {menuOpen && (
        <button
          className="mobile-nav-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <Navigation open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </header>
  );
}
