import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <div className="detail-image">
      <Image
        src={product.image_url}
        alt={product.name}
        fill
        priority
        sizes="(max-width: 760px) 100vw, 55vw"
        className="detail-product-img"
      />
      <span className="gallery-caption">AKIRA EDIT · PRODUCT IMAGE</span>
    </div>
  );
}
