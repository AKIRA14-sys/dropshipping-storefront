import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store policies",
  description: "Demo policy notes for the AKIRA STORE storefront.",
};
export default function PoliciesPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">CLEAR EXPECTATIONS MATTER</span>
      <h1>Policies & important notes.</h1>
      <p className="lead">
        This is a starter policy page, not legal advice or a complete set of live store terms. Replace it with
        accurate, reviewed policies before accepting real orders.
      </p>
      <div className="content-callout">
        <strong>Demo storefront only.</strong> Sample catalogue details, prices, delivery arrangements,
        contact channels and policies are not a live offer. No payment is collected.
      </div>
      <section className="policy-section">
        <h2>Orders and payment</h2>
        <p>
          This version has no payment gateway. Where Supabase is configured, a checkout submission creates an
          order record marked “awaiting payment”; that status is not a paid or confirmed order. In demo mode,
          the record remains in the browser that placed it.
        </p>
      </section>
      <section className="policy-section">
        <h2>Delivery</h2>
        <p>
          Delivery coverage, delivery charges, dispatch times and tracking arrangements have not been set. Add
          the store’s real delivery terms and communicate them clearly before launch.
        </p>
      </section>
      <section className="policy-section">
        <h2>Returns and refunds</h2>
        <p>
          No returns or refund terms are live yet. Create a policy that reflects applicable consumer law, real
          supplier arrangements and the store’s process before making products available for purchase.
        </p>
      </section>
      <section className="policy-section">
        <h2>Privacy and customer information</h2>
        <p>
          When the Supabase order feature is configured, delivery details submitted at checkout are sent to
          the store’s Supabase project so the order can be recorded. Do not use real customer data until
          access, retention, deletion and privacy notices are configured. In demo mode, the browser stores
          only the tracking code, email, name, item names, quantities and estimated total for local tracking;
          it is not sent to a server.
        </p>
        <p>
          Before launch, publish a privacy notice, set an appropriate retention period, secure project access
          and provide a way for customers to ask about or delete their data.
        </p>
      </section>
      <section className="policy-section">
        <h2>Product information</h2>
        <p>
          The supplied pictures are illustrative starter assets, and the product descriptions and sample
          prices are not verified. Replace them with accurate information and images you have permission to
          use.
        </p>
      </section>
      <ul className="policy-list">
        <li>Set and publish a real support email or phone number.</li>
        <li>Review customer terms and privacy language for the markets you serve.</li>
        <li>Confirm supplier, stock, product safety, warranty and delivery claims.</li>
      </ul>
    </article>
  );
}
