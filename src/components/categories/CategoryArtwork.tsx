import Image from "next/image";
import {
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Gamepad2,
  Grid3X3,
  Headphones,
  Laptop,
  Plane,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
} from "lucide-react";
import type { Category } from "@/types/category";

const icons = {
  smartphone: Smartphone,
  laptop: Laptop,
  gamepad: Gamepad2,
  audio: Headphones,
  appliance: Grid3X3,
  fashion: Shirt,
  beauty: Sparkles,
  collectibles: ShoppingBag,
  school: BookOpen,
  sports: Dumbbell,
  toys: Baby,
  home: Sofa,
  automotive: Car,
  travel: Plane,
  grid: Grid3X3,
};

export function CategoryArtwork({
  category,
  sizes = "(max-width: 700px) 70vw, 24vw",
  className = "",
}: {
  category: Category;
  sizes?: string;
  className?: string;
}) {
  const Icon = icons[(category.icon_key || "grid") as keyof typeof icons] || Grid3X3;
  return (
    <div
      className={`category-art category-art-${category.icon_key || "grid"} ${className}`}
      aria-hidden="true"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt=""
          fill
          sizes={sizes}
          className="category-art-image"
          unoptimized={category.image_url.startsWith("http")}
        />
      ) : (
        <span className="category-art-icon">
          <Icon size={54} strokeWidth={1.25} />
        </span>
      )}
      <span className="category-art-glow" />
    </div>
  );
}
