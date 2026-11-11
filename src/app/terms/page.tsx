import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms and current order-acceptance status for the store.",
};
export default function TermsPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">TERMS & CONDITIONS</span>
      <h1>Terms of use.</h1>
      <p className="lead">
        The final seller identity, applicable law, sales terms and consumer policies have not yet been
        supplied by the store owner. This page must be completed and reviewed before sales open.
      </p>
      <div className="content-callout">
        <strong>This site is not currently accepting orders.</strong> Product browsing does not create an
        offer, order, payment obligation or confirmed delivery.
      </div>
      <section className="policy-section">
        <h2>Before launch</h2>
        <p>
          Publish accurate details for the legal seller, product descriptions, taxes and prices, order
          acceptance, cancellations, delivery, returns, warranties, customer support and applicable consumer
          rights. The owner should review terms for each intended market. No term on this page replaces that
          review.
        </p>
      </section>
    </article>
  );
}
