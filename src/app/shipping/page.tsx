import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Shipping and delivery",
  description: "Current delivery arrangements and what has not yet been confirmed.",
};
export default function ShippingPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">DELIVERY INFORMATION</span>
      <h1>Shipping & delivery.</h1>
      <p className="lead">
        The store has not yet published delivery coverage, charges, dispatch estimates or tracking
        arrangements.
      </p>
      <div className="content-callout">
        <strong>No delivery promise is live.</strong> Checkout is not open, so no shipping fee or delivery
        time can currently be confirmed.
      </div>
      <section className="policy-section">
        <h2>Before purchases can open</h2>
        <p>
          The store owner needs to confirm the delivery regions, supplier/dispatch timelines, carrier
          arrangements, delivery charges, missed-delivery handling and customer updates. The page will be
          updated with the confirmed terms before orders are accepted.
        </p>
      </section>
      <p>
        For questions, use the verified contact channel on the <Link href="/contact">Contact page</Link>, if
        one is published.
      </p>
    </article>
  );
}
