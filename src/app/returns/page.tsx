import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "Draft returns information for the AKIRA STORE demo.",
};
export default function ReturnsPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A FAIR WAY TO MAKE IT RIGHT</span>
      <h1>Returns & refunds.</h1>
      <p className="lead">A live returns and refund policy has not been configured yet.</p>
      <div className="content-callout">
        <strong>This page is not a live policy.</strong> Replace it with reviewed terms that match applicable
        consumer rules, your supplier agreements, product types and real refund process before taking orders.
      </div>
      <section className="policy-section">
        <h2>What the store owner still needs to decide</h2>
        <p>
          Set the return window, item condition requirements, exclusions, return shipping responsibility,
          faulty-item process, exchange options and refund method. Explain how a customer should reach support
          using verified contact details.
        </p>
      </section>
      <Link href="/policies" className="text-link">
        See all policy notes
      </Link>
    </article>
  );
}
