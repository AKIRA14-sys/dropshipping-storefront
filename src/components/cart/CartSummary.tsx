import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/utils";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <aside className="order-summary">
      <h2>Bag summary</h2>
      <div className="summary-line">
        <span>Subtotal</span>
        <span>{formatNaira(subtotal)}</span>
      </div>
      <div className="summary-line">
        <span>Delivery</span>
        <span>Confirmed separately</span>
      </div>
      <div className="summary-line summary-total">
        <span>Estimated total</span>
        <span>{formatNaira(subtotal)}</span>
      </div>
      <div className="summary-note">
        Demo prices are illustrative. Delivery fees are not included and are confirmed separately.
      </div>
      <Link href="/checkout" className="button button-dark">
        Add delivery details <ArrowRight size={16} />
      </Link>
      <Link href="/track" className="continue-shopping">
        Already ordered? Track your order
      </Link>
    </aside>
  );
}
