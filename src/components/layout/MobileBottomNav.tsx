"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, House, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/context/CartContext";

const destinations = [
  { href: "/", label: "Home", icon: House, matches: (path: string) => path === "/" },
  {
    href: "/explore",
    label: "Explore",
    icon: Compass,
    matches: (path: string) =>
      path === "/explore" ||
      path === "/shop" ||
      path === "/search" ||
      path.startsWith("/categories/") ||
      path.startsWith("/products/") ||
      path === "/new-arrivals" ||
      path === "/offers",
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingBag,
    matches: (path: string) => path === "/cart" || path === "/wishlist",
  },
  {
    href: "/account",
    label: "Me",
    icon: UserRound,
    matches: (path: string) =>
      path.startsWith("/account") || path.startsWith("/login") || path.startsWith("/signup"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  return (
    <nav className="mobile-bottom-nav" aria-label="Primary">
      {destinations.map((destination) => {
        const Icon = destination.icon;
        const active = destination.matches(pathname);
        const cartLabel = destination.label === "Cart" ? `Cart, ${itemCount} items` : destination.label;
        return (
          <Link
            key={destination.href}
            href={destination.href}
            className={`bottom-nav-item ${active ? "is-active" : ""}`}
            aria-label={cartLabel}
            aria-current={active ? "page" : undefined}
          >
            <span className="bottom-nav-icon-wrap">
              <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
              {destination.label === "Cart" && itemCount > 0 && (
                <span className="bottom-nav-count" aria-hidden="true">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </span>
            <span>{destination.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
