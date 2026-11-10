import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/category";

const categoryImages: Record<string, string> = {
  beauty: "/images/skincare-hero.jpg",
  fashion: "/images/fashion-flatlay.jpg",
  electronics: "/images/gadgets.jpg",
  "home-living": "/images/home-living.jpg",
};

export function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="category-section section-wrap">
      <div className="section-heading">
        <div>
          <span className="eyebrow">A LITTLE BIT OF EVERYTHING</span>
          <h2>Find your corner.</h2>
        </div>
        <Link href="/shop" className="text-link">
          Shop everything <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => (
          <Link
            href={`/categories/${category.slug}`}
            className={`category-tile category-tile-${index + 1}`}
            key={category.slug}
          >
            <div className="category-image">
              <Image
                src={categoryImages[category.slug] ?? categoryImages.beauty}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="category-overlay">
              <span className="category-index">0{index + 1} / SHOP THE EDIT</span>
              <div>
                <span>
                  <strong>{category.name}</strong>
                  <small>{category.description}</small>
                </span>
                <span className="round-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
