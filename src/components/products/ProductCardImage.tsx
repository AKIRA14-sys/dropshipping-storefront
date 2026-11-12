"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type ProductCardImageProps = {
  src: string;
  fallbackSrc?: string | null;
  alt: string;
  sizes: string;
  className?: string;
};

export function ProductCardImage({ src, fallbackSrc, alt, sizes, className }: ProductCardImageProps) {
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(() => new Set());
  const currentSource = failedSources.has(src)
    ? fallbackSrc && !failedSources.has(fallbackSrc)
      ? fallbackSrc
      : null
    : src;

  if (!currentSource) {
    return (
      <div className="product-image-placeholder" role="img" aria-label="No product image available">
        <ImageOff size={30} aria-hidden="true" />
        <span>Image coming soon</span>
      </div>
    );
  }

  return (
    <Image
      src={currentSource}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailedSources((previous) => new Set(previous).add(currentSource))}
    />
  );
}
