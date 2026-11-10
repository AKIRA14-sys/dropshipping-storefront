import type { Metadata } from "next";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for the AKIRA STORE demo storefront.",
};

export default function ContactPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">WE’RE HERE TO HELP</span>
      <h1>Let’s talk.</h1>
      <p className="lead">
        A helpful contact page is part of a good shopping experience. The real store email, WhatsApp number
        and support hours have not been configured yet, so we’re not publishing placeholder contact details.
      </p>
      <div className="content-callout">
        <strong>Contact is not connected in this demo.</strong> No customer message form is active and no
        messages are collected here. Add a verified support inbox or WhatsApp channel before the storefront is
        opened to shoppers.
      </div>
      <h2 className="policy-section">For the store owner</h2>
      <p>
        In the repository, update this page with a support email or a WhatsApp link that you control. If you
        add a form, connect it to a trusted inbox and publish a privacy notice explaining how messages are
        handled.
      </p>
      <InfoPageCta />
    </article>
  );
}
