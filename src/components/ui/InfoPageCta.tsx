import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function InfoPageCta({ label = "Browse the demo shop" }: { label?: string }) {
  return (
    <div className="content-callout">
      <strong>Still getting things ready.</strong> This storefront is a demo. The catalogue and contact
      details need to be confirmed before a public launch.
      <div style={{ marginTop: 14 }}>
        <Link href="/shop" className="button button-outline">
          {label} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
