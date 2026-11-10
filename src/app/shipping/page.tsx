import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & delivery",
  description: "Demo shipping information for AKIRA STORE.",
};
export default function ShippingPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">DELIVERY, MADE CLEAR</span>
      <h1>Shipping & delivery.</h1>
      <p className="lead">
        Delivery coverage, fees and timing are not yet configured for this demo storefront.
      </p>
      <div className="content-callout">
        <strong>No delivery promise is live.</strong> The amount shown in checkout excludes delivery. Confirm
        the address, delivery cost and estimated timing with the store only after real fulfilment details are
        set.
      </div>
      <section className="policy-section">
        <h2>Before launch</h2>
        <p>
          Add your actual delivery areas, dispatch windows, delivery-fee rules, carrier details,
          failed-delivery process and tracking expectations. Do not publish estimates until suppliers and
          couriers have confirmed them.
        </p>
      </section>
      <Link href="/policies" className="text-link">
        See all policy notes
      </Link>
    </article>
  );
}
