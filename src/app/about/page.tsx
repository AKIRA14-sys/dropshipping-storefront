import type { Metadata } from "next";
import { Heart, Layers3, Search } from "lucide-react";
import { storeName } from "@/config/store";
import { InfoPageCta } from "@/components/ui/InfoPageCta";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the four departments at our multi-category shop.",
};
export default function AboutPage() {
  return (
    <article className="section-wrap content-page">
      <span className="eyebrow">A LITTLE HELLO FROM {storeName.toUpperCase()}</span>
      <h1>
        Useful finds.
        <br />
        <em>One easy shop.</em>
      </h1>
      <p className="lead">
        {storeName} brings four everyday departments together: fashion, anime and collectibles, school
        supplies, and home appliances.
      </p>
      <div className="content-card-grid">
        <div className="content-card">
          <span className="card-num">
            <Layers3 size={17} />
          </span>
          <h2>More to explore</h2>
          <p>Move between four clear departments and find the product information you need in one place.</p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Search size={17} />
          </span>
          <h2>Details matter</h2>
          <p>Listings are intended to show current product information, real options, and available stock.</p>
        </div>
        <div className="content-card">
          <span className="card-num">
            <Heart size={17} />
          </span>
          <h2>Keep your picks</h2>
          <p>Browse without an account, save a wishlist, and manage account details when you sign in.</p>
        </div>
      </div>
      <p className="lead">
        The store name is a temporary placeholder until the owner confirms the final brand. The catalogue will
        show products only when real inventory is connected and published.
      </p>
      <InfoPageCta />
    </article>
  );
}
