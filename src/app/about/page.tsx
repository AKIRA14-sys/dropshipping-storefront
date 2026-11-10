import type { Metadata } from "next";
import { Heart, Sparkles, Sprout } from "lucide-react";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: "About AKIRA STORE",
  description: "Learn about the idea behind the AKIRA STORE demo storefront.",
};

export default function AboutPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A LITTLE HELLO FROM US</span>
      <h1>
        Good finds.
        <br />
        <em>Good feeling.</em>
      </h1>
      <p className="lead">
        AKIRA STORE is being shaped as a thoughtful corner for useful, feel-good finds across beauty, fashion,
        electronics and home.
      </p>
      <div className="content-card-grid">
        <div className="content-card">
          <span className="card-num">
            <Sparkles size={16} />
          </span>
          <h2>Everyday useful</h2>
          <p>We want the things here to feel easy to browse and easy to imagine in your day.</p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Heart size={16} />
          </span>
          <h2>Picked with care</h2>
          <p>Clear product details and honest information should come before a purchase.</p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Sprout size={16} />
          </span>
          <h2>Still growing</h2>
          <p>
            This storefront is a working demo. The final catalogue, supplier details and store policies still
            need to be confirmed.
          </p>
        </div>
      </div>
      <p className="lead">
        The best shops are built on trust. Before launch, every product listing, price, delivery promise and
        contact channel will need to be checked and made specific to the real store.
      </p>
      <InfoPageCta />
    </article>
  );
}
