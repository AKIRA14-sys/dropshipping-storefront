import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/category";

export function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="category-section section-wrap" id="departments">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FOUR WAYS TO FIND YOUR NEXT THING</span>
          <h2>Choose your department.</h2>
        </div>
        <Link href="/shop" className="text-link">
          Shop all <ArrowUpRight size={15} />
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
              <Image src={category.image_url} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
            <div className="category-overlay">
              <span className="category-index">0{index + 1} / DEPARTMENT</span>
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
