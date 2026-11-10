import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export const CATEGORIES: Category[] = [
  { slug: "beauty", name: "Beauty & care", description: "Small rituals, feel-good essentials." },
  { slug: "fashion", name: "Fashion", description: "Easy pieces and everyday accessories." },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Useful tech for work, play and everything between.",
  },
  {
    slug: "home-living",
    name: "Home & living",
    description: "Thoughtful touches for a more comfortable home.",
  },
];

// Illustrative placeholder products and prices, not the owner's real catalog.
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-01",
    slug: "daily-dew-vitamin-serum",
    name: "Daily Dew Vitamin Serum",
    description:
      "A lightweight daily serum for a fresh, comfortable-feeling routine. Demo catalog item; confirm ingredients and claims before selling.",
    price_ngn: 14900,
    compare_at_price_ngn: 18900,
    category_slug: "beauty",
    category_name: "Beauty & care",
    image_url: "/images/skincare-hero.jpg",
    featured: true,
  },
  {
    id: "demo-02",
    slug: "gentle-cloud-cleanser",
    name: "Gentle Cloud Cleanser",
    description:
      "A simple, gentle-feeling cleanser for your morning or evening routine. Demo catalog item; confirm ingredients and claims before selling.",
    price_ngn: 11900,
    category_slug: "beauty",
    category_name: "Beauty & care",
    image_url: "/images/skincare-hero.jpg",
    featured: true,
  },
  {
    id: "demo-03",
    slug: "everyday-cross-strap-sandals",
    name: "Everyday Cross-Strap Sandals",
    description:
      "An easy-to-style pair for relaxed days out. Demo listing: check sizes, materials and supplier details before launch.",
    price_ngn: 18500,
    compare_at_price_ngn: 22500,
    category_slug: "fashion",
    category_name: "Fashion",
    image_url: "/images/fashion-flatlay.jpg",
    featured: true,
  },
  {
    id: "demo-04",
    slug: "weekend-denim-tote",
    name: "Weekend Denim Tote",
    description:
      "A room-for-the-essentials carryall with an easy weekend feel. Demo listing: check dimensions and materials before launch.",
    price_ngn: 12900,
    category_slug: "fashion",
    category_name: "Fashion",
    image_url: "/images/fashion-flatlay.jpg",
  },
  {
    id: "demo-05",
    slug: "everyday-wireless-earbuds",
    name: "Everyday Wireless Earbuds",
    description:
      "Compact wireless audio for commutes, calls and playlists. Demo listing: verify compatibility, battery claims and warranty before launch.",
    price_ngn: 24900,
    compare_at_price_ngn: 29900,
    category_slug: "electronics",
    category_name: "Electronics",
    image_url: "/images/gadgets.jpg",
    featured: true,
  },
  {
    id: "demo-06",
    slug: "smart-watch-lite",
    name: "Smart Watch Lite",
    description:
      "A simple everyday wearable with a clean, easy-to-read look. Demo listing: verify features and compatibility before launch.",
    price_ngn: 32500,
    category_slug: "electronics",
    category_name: "Electronics",
    image_url: "/images/gadgets.jpg",
  },
  {
    id: "demo-07",
    slug: "soft-touch-throw",
    name: "Soft-Touch Lounge Throw",
    description:
      "A cosy accent for a quiet evening or a relaxed living room. Demo listing: check dimensions and fabric details before launch.",
    price_ngn: 19900,
    compare_at_price_ngn: 24900,
    category_slug: "home-living",
    category_name: "Home & living",
    image_url: "/images/home-living.jpg",
    featured: true,
  },
  {
    id: "demo-08",
    slug: "warm-glow-table-lamp",
    name: "Warm Glow Table Lamp",
    description:
      "A soft ambient accent for a bedside or reading nook. Demo listing: confirm dimensions and electrical certification before launch.",
    price_ngn: 28500,
    category_slug: "home-living",
    category_name: "Home & living",
    image_url: "/images/home-living.jpg",
  },
];
