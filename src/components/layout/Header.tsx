"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Navigation } from "@/components/layout/Navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  return (
    <>
      <div className="announcement">
        <span>Little things, lovely finds.</span>
        <span className="announcement-right">
          A demo storefront · No payment is collected <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </div>
      <header className="site-header">
        <div className="header-main">
          <MobileMenu open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
          <Link href="/" className="brand" aria-label="AKIRA STORE home">
            <span className="brand-mark">A</span>
            <span className="brand-copy">
              <strong>AKIRA</strong>
              <small>STORE</small>
            </span>
          </Link>
          <form className="header-search" action="/search" role="search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Search your next favourite…"
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>
          <div className="header-actions">
            <Link href="/search" className="mobile-search-link" aria-label="Search products">
              <Search size={20} />
            </Link>
            <Link className="bag-link" href="/cart" aria-label={`Shopping bag, ${itemCount} items`}>
              <ShoppingBag size={21} strokeWidth={1.8} />
              <span>Bag</span>
              {itemCount > 0 && <b className="bag-count">{itemCount}</b>}
            </Link>
          </div>
        </div>
        <Navigation open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      </header>
    </>
  );
}
