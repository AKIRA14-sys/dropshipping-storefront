import { isBackendConfigured, isUsingDemoCatalog } from "@/lib/products";

export function DemoBanner() {
  if (!isUsingDemoCatalog()) return null;
  const backend = isBackendConfigured();
  return (
    <div className="demo-banner">
      <span className="demo-dot" /> DEMO MODE{" "}
      <span>
        {backend
          ? "Sample products and prices · no payment is taken"
          : "Sample products and prices · orders stay in this browser · no payment is taken"}
      </span>
    </div>
  );
}
