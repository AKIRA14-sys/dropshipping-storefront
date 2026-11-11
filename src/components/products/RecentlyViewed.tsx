"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { verifyProducts } from "@/lib/catalog-browser";
import { ProductGrid } from "@/components/products/ProductGrid";

const KEY = "storefront.recently-viewed.v1";
export function RecentlyViewed({ currentProduct }: { currentProduct: Product }) {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const value: unknown = JSON.parse(window.localStorage.getItem(KEY) || "[]");
        const priorIds = Array.isArray(value)
          ? value.filter((id): id is string => typeof id === "string" && id !== currentProduct.id).slice(0, 8)
          : [];
        const nextIds = [currentProduct.id, ...priorIds].slice(0, 9);
        window.localStorage.setItem(KEY, JSON.stringify(nextIds));
        const recent = await verifyProducts(priorIds);
        if (!cancelled) setItems(recent.slice(0, 4));
      } catch {
        if (!cancelled) setItems([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [currentProduct.id]);
  if (!items.length) return null;
  return (
    <section className="recently-viewed section-wrap">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FROM THIS DEVICE</span>
          <h2>Recently viewed.</h2>
        </div>
      </div>
      <ProductGrid products={items} />
    </section>
  );
}
