import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCatalog, getNewArrivals } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "Explore new products published by the store.",
};
export default async function NewArrivalsPage() {
  const [catalog, products] = await Promise.all([getCatalog(), getNewArrivals(48)]);
  return (
    <section className="section-wrap page-section collection-page">
      <div className="page-intro">
        <div>
          <span className="eyebrow">RECENTLY PUBLISHED</span>
          <h1>New arrivals.</h1>
          <p>Only products explicitly marked as new by the store are shown here.</p>
        </div>
      </div>
      {catalog.state !== "ready" ? (
        <CatalogEmptyState state={catalog.state} />
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="empty-state">
          <h2>No new arrivals just yet.</h2>
          <p>Check back when the store publishes its next collection.</p>
          <Link href="/shop" className="button button-outline">
            Browse the catalog <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}
