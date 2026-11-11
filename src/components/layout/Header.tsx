"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, UserRound } from "lucide-react";
import type { Category } from "@/types/category";
import { useCart } from "@/context/CartContext";
import { Navigation } from "@/components/layout/Navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { StoreLogo } from "@/components/layout/Logo";
import { HeaderSearch } from "@/components/layout/HeaderSearch";

export function SiteHeader({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    if (!menuOpen) return;
    const drawer = document.getElementById("navigation-drawer");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => drawer?.querySelector<HTMLElement>(".drawer-close")?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  return (
    <header className="site-header app-site-header">
      <div className="header-main app-header-main">
        <MobileMenu buttonRef={triggerRef} open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
        <StoreLogo />
        <div className="app-header-search">
          <HeaderSearch />
        </div>
        <div className="header-actions app-header-actions">
          <Link className="header-action-link app-header-me" href="/account" aria-label="Me and my account">
            <UserRound size={20} strokeWidth={1.8} />
            <span>Me</span>
          </Link>
          <Link className="bag-link app-header-cart" href="/cart" aria-label={`Cart, ${itemCount} items`}>
            <ShoppingBag size={21} strokeWidth={1.8} />
            <span>Cart</span>
            {itemCount > 0 && <b className="bag-count">{itemCount > 99 ? "99+" : itemCount}</b>}
          </Link>
        </div>
      </div>
      <Navigation open={menuOpen} categories={categories} onNavigate={() => setMenuOpen(false)} />
    </header>
  );
}
