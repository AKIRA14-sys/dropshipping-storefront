import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Returns and refunds",
  description: "Current return and refund policy status.",
};
export default function ReturnsPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">RETURNS & REFUNDS</span>
      <h1>Returns & refunds.</h1>
      <p className="lead">A complete returns and refunds policy has not been published by the store owner.</p>
      <div className="content-callout">
        <strong>Orders are not currently being accepted.</strong> No purchase or refund request can be started
        from this site yet.
      </div>
      <section className="policy-section">
        <h2>What will be explained before launch</h2>
        <p>
          The final policy needs to describe return eligibility and time limits, product-condition
          requirements, faulty or incorrect items, return shipping, exchanges, refund method and how to
          contact support. Terms will be published after the owner confirms them for the markets served.
        </p>
      </section>
      <p>
        For verified store contact details, see <Link href="/contact">Contact</Link>.
      </p>
    </article>
  );
}
