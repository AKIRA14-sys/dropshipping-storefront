import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import type { CatalogState } from "@/lib/products";

const messages: Record<Exclude<CatalogState, "ready">, { title: string; body: string }> = {
  "not-configured": {
    title: "The catalog is being prepared.",
    body: "This shop will show products only after its live inventory is connected and published.",
  },
  unavailable: {
    title: "We couldn't load products just now.",
    body: "Please try again in a little while. No cached prices or stock details are shown.",
  },
  empty: {
    title: "No products are published yet.",
    body: "The departments are ready to browse. Products will appear here once the store adds verified listings.",
  },
};

export function CatalogEmptyState({ state, compact = false }: { state: CatalogState; compact?: boolean }) {
  if (state === "ready") return null;
  const message = messages[state];
  return (
    <div className={`catalog-empty ${compact ? "catalog-empty-compact" : ""}`} role="status">
      <span className="catalog-empty-icon">
        <PackageSearch size={24} />
      </span>
      <div>
        <h2>{message.title}</h2>
        <p>{message.body}</p>
      </div>
      {!compact && (
        <Link className="button button-outline" href="/categories/fashion">
          Explore departments <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
