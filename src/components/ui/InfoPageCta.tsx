import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function InfoPageCta({ label = "Browse the shop" }: { label?: string }) {
  return (
    <div className="content-callout">
      <strong>Clear, current product information comes first.</strong> Only live catalog items are displayed;
      checkout will remain closed until secure order handling is ready.
      <div className="info-cta-actions">
        <Link href="/shop" className="button button-outline">
          {label} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
