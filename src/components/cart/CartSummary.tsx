import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function CartSummary({
  currencySubtotals,
}: {
  currencySubtotals: { currencyCode: string; amount: number }[];
}) {
  return (
    <aside className="order-summary">
      <h2>Bag summary</h2>
      {currencySubtotals.map((item) => (
        <div className="summary-line" key={item.currencyCode}>
          <span>{currencySubtotals.length > 1 ? `Subtotal (${item.currencyCode})` : "Subtotal"}</span>
          <span>{formatPrice(item.amount, item.currencyCode)}</span>
        </div>
      ))}
      {currencySubtotals.length > 1 && (
        <p className="summary-currency-note">
          Amounts stay in each product's listed currency. No exchange conversion has been applied.
        </p>
      )}
      <div className="summary-line">
        <span>Delivery</span>
        <span>Not yet available</span>
      </div>
      <div className="summary-note">
        Subtotals use current published product prices. Delivery costs are not configured, and checkout is not
        accepting orders or payments.
      </div>
      <Link href="/checkout" className="button button-dark">
        Continue to checkout preview <ArrowRight size={16} />
      </Link>
    </aside>
  );
}
