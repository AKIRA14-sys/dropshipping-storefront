import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/category";

export function DepartmentSpotlight({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  const dateIndex = Math.floor(Date.now() / 86_400_000) % categories.length;
  const category = categories[dateIndex];
  return (
    <section className="department-spotlight section-wrap">
      <div className="spotlight-art">
        <Image src={category.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 45vw" />
      </div>
      <div className="spotlight-copy">
        <span className="eyebrow">DEPARTMENT SPOTLIGHT · ROTATES DAILY</span>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
        <div className="spotlight-tags">
          {category.subcategories.slice(0, 4).map((item) => (
            <span key={item.slug}>{item.name}</span>
          ))}
        </div>
        <Link className="button button-dark" href={`/categories/${category.slug}`}>
          Explore {category.name} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
