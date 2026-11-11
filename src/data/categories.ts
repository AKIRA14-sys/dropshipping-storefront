import type { Category, CategorySlug } from "@/types/category";

export const STORE_CATEGORIES: Category[] = [
  {
    slug: "fashion",
    name: "Fashion",
    description: "Clothing, shoes, bags and accessories.",
    image_url: "/categories/fashion.svg",
    display_order: 1,
    subcategories: [
      { slug: "mens-fashion", name: "Men's fashion" },
      { slug: "womens-fashion", name: "Women's fashion" },
      { slug: "clothing", name: "Clothing" },
      { slug: "shoes", name: "Shoes" },
      { slug: "bags", name: "Bags" },
      { slug: "accessories", name: "Accessories" },
    ],
  },
  {
    slug: "anime",
    name: "Anime & Collectibles",
    description: "Anime-inspired collections and collectibles.",
    image_url: "/categories/anime.svg",
    display_order: 2,
    subcategories: [
      { slug: "anime-figures", name: "Anime figures" },
      { slug: "anime-plushies", name: "Anime plushies" },
      { slug: "anime-clothing", name: "Anime clothing" },
      { slug: "anime-accessories", name: "Anime accessories" },
      { slug: "collectibles", name: "Collectibles" },
    ],
  },
  {
    slug: "school-supplies",
    name: "School Supplies",
    description: "Bags, writing materials, notebooks and stationery.",
    image_url: "/categories/school-supplies.svg",
    display_order: 3,
    subcategories: [
      { slug: "school-bags", name: "School bags" },
      { slug: "backpacks", name: "Backpacks" },
      { slug: "writing-materials", name: "Writing materials" },
      { slug: "notebooks", name: "Notebooks" },
      { slug: "stationery", name: "Stationery" },
      { slug: "school-accessories", name: "School accessories" },
    ],
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    description: "Useful appliances and everyday home electronics.",
    image_url: "/categories/home-appliances.svg",
    display_order: 4,
    subcategories: [
      { slug: "kitchen-appliances", name: "Kitchen appliances" },
      { slug: "cleaning-appliances", name: "Cleaning appliances" },
      { slug: "personal-appliances", name: "Personal appliances" },
      { slug: "home-electronics", name: "Home electronics" },
      { slug: "small-household-appliances", name: "Small household appliances" },
    ],
  },
];

export function isCategorySlug(value: string): value is CategorySlug {
  return STORE_CATEGORIES.some((category) => category.slug === value);
}

export function getStaticCategory(slug: string): Category | undefined {
  return STORE_CATEGORIES.find((category) => category.slug === slug);
}
