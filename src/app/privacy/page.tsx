import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notes for the AKIRA STORE demo storefront.",
};
export default function PrivacyPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">YOUR DETAILS DESERVE CARE</span>
      <h1>Privacy note.</h1>
      <p className="lead">
        This is a technical starter notice, not a complete legal privacy policy. Review it for your business
        and the places you serve before accepting real customer information.
      </p>
      <section className="policy-section">
        <h2>Demo-only checkout</h2>
        <p>
          When the demo runs without Supabase settings, delivery details entered for checkout are not sent to
          a server. A local tracking record—name, email, tracking code, item names, quantities and estimated
          total—is kept in the browser’s local storage on that device so the demo order can be looked up
          there.
        </p>
      </section>
      <section className="policy-section">
        <h2>Supabase-backed checkout</h2>
        <p>
          When the project is configured, delivery details are sent to the owner’s Supabase database to create
          and track an order. Public visitors cannot directly read order tables; tracking requires the
          tracking code and checkout email. No payment card data is collected by this app.
        </p>
      </section>
      <section className="policy-section">
        <h2>Before real use</h2>
        <p>
          Document who controls the data, the purpose and lawful basis for processing, retention period,
          deletion/access requests, contact details, any processors, and relevant safeguards. Clear old demo
          orders from local storage in shared devices.
        </p>
      </section>
    </article>
  );
}
