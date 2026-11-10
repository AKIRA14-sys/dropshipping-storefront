import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Starter terms for the AKIRA STORE demo storefront.",
};
export default function TermsPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">THE IMPORTANT BITS</span>
      <h1>Terms of use.</h1>
      <p className="lead">
        These are demo notes, not final legal terms. They must be reviewed and adapted for the actual store
        before any real sales are accepted.
      </p>
      <section className="policy-section">
        <h2>Demonstration content</h2>
        <p>
          Product titles, photos, descriptions, categories, sample naira prices and offers are illustrative
          only. They do not represent verified inventory or a current commercial offer.
        </p>
      </section>
      <section className="policy-section">
        <h2>Checkout and order status</h2>
        <p>
          This app does not collect payment. A Supabase-backed order begins with the status “awaiting
          payment”; it is not a paid or accepted order. Demo-only orders are saved locally to the device
          running the browser.
        </p>
      </section>
      <section className="policy-section">
        <h2>Real store terms</h2>
        <p>
          Before launch, define customer eligibility, order acceptance, prices/taxes, delivery, cancellations,
          returns, warranty, complaint handling and governing terms with appropriate professional review.
        </p>
      </section>
    </article>
  );
}
