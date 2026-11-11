"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Grid3X3,
  Heart,
  House,
  Package,
  Search,
  ShoppingBag,
  UserRound,
  MapPin,
  X,
} from "lucide-react";
import type { Category } from "@/types/category";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";

export function Navigation({
  open,
  categories,
  onNavigate,
}: {
  open: boolean;
  categories: Category[];
  onNavigate: () => void;
}) {
  return (
    <>
      <button
        className={`app-drawer-backdrop ${open ? "is-visible" : ""}`}
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onNavigate}
      />
      <aside
        id="navigation-drawer"
        className={`app-drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label="Shopping navigation"
        inert={!open}
      >
        <div className="drawer-topline">
          <div>
            <span className="drawer-kicker">DISCOVER</span>
            <h2>Where to next?</h2>
          </div>
          <button className="drawer-close" type="button" onClick={onNavigate} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="drawer-destinations" aria-label="Main destinations">
          <Link href="/" onClick={onNavigate}>
            <House size={19} /> <span>Home</span> <ArrowUpRight size={15} />
          </Link>
          <Link href="/explore" onClick={onNavigate}>
            <Search size={19} /> <span>Explore</span> <ArrowUpRight size={15} />
          </Link>
          <Link href="/cart" onClick={onNavigate}>
            <ShoppingBag size={19} /> <span>Cart & saved</span> <ArrowUpRight size={15} />
          </Link>
          <Link href="/account" onClick={onNavigate}>
            <UserRound size={19} /> <span>Me & my account</span> <ArrowUpRight size={15} />
          </Link>
        </nav>

        <div className="drawer-departments-heading">
          <div>
            <span className="drawer-kicker">BROWSE BY DEPARTMENT</span>
            <h3>All departments</h3>
          </div>
          <Grid3X3 size={18} aria-hidden="true" />
        </div>
        <nav className="drawer-departments" aria-label="Shop departments">
          {categories.map((category) => (
            <details className="drawer-department" key={category.slug}>
              <summary>
                <span className="drawer-category-icon" aria-hidden="true">
                  <CategoryArtwork category={category} sizes="48px" />
                </span>
                <span className="drawer-category-name">{category.name}</span>
                <ChevronDown size={16} className="drawer-chevron" />
              </summary>
              <div className="drawer-subcategories">
                <Link href={`/categories/${category.slug}`} onClick={onNavigate}>
                  Browse department <ArrowUpRight size={13} />
                </Link>
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={`${category.slug}-${subcategory.slug}`}
                    href={`/categories/${category.slug}?subcategory=${encodeURIComponent(subcategory.slug)}`}
                    onClick={onNavigate}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          {!categories.length && (
            <p className="drawer-empty">Departments are temporarily unavailable. Please try again later.</p>
          )}
        </nav>
        <div className="drawer-utilities" aria-label="Collections and account shortcuts">
          <span className="drawer-kicker">COLLECTIONS & YOUR ACCOUNT</span>
          <div className="drawer-utility-grid">
            <Link href="/new-arrivals" onClick={onNavigate}>
              New arrivals <ArrowUpRight size={13} />
            </Link>
            <Link href="/offers" onClick={onNavigate}>
              Offers <ArrowUpRight size={13} />
            </Link>
            <Link href="/cart?view=saved" onClick={onNavigate}>
              <Heart size={14} /> Wishlist
            </Link>
            <Link href="/account/orders" onClick={onNavigate}>
              <Package size={14} /> Orders
            </Link>
            <Link href="/account/addresses" onClick={onNavigate}>
              <MapPin size={14} /> Addresses
            </Link>
            <Link href="/faq" onClick={onNavigate}>
              Help & FAQs <ArrowUpRight size={13} />
            </Link>
            <Link href="/contact" onClick={onNavigate}>
              Contact the store <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
