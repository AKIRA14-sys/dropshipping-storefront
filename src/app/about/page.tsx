import type { Metadata } from "next";
import { Heart, Layers3, Search } from "lucide-react";
import { storeName } from "@/config/store";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: `About ${storeName}`,
  description: `Learn about ${storeName}, a multi-category shopping experience.`,
};

export default function AboutPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A LITTLE HELLO FROM {storeName}</span>
      <h1>
        Find something new.
        <br />
        <em>Make it yours.</em>
      </h1>
      <p className="lead">
        {storeName} brings a growing range of departments together in one place—from phones and computers to
        fashion, beauty, home, sports, travel and more.
      </p>
      <div className="content-card-grid">
        <div className="content-card">
          <span className="card-num">
            <Layers3 size={17} />
          </span>
          <h2>Explore your way</h2>
          <p>
            Browse by department, search the catalog and narrow results using details published with each
            item.
          </p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Search size={17} />
          </span>
          <h2>Current listings only</h2>
          <p>
            Product pages are shown only when the store has published an active listing with current
            information.
          </p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Heart size={17} />
          </span>
          <h2>Save your finds</h2>
          <p>
            Browse as a guest, keep a cart and wishlist on this device, or sign in to sync saved items to your
            account.
          </p>
        </div>
      </div>
      <p className="lead">
        Checkout is currently paused. The store will show an order and payment flow only after verified
        payment and order handling are connected.
      </p>
      <InfoPageCta />
    </article>
  );
}
