import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface StorePromotion {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
}

function safeInternalUrl(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/shop";
}

export function Promotions({ promotions }: { promotions: StorePromotion[] }) {
  if (!promotions.length) return null;
  return (
    <section className="promotion-section section-wrap" aria-label="Store promotions">
      {promotions.map((promotion) => (
        <article className="promotion-card" key={promotion.id}>
          {promotion.image_url && (
            <div className="promotion-image">
              <Image src={promotion.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 36vw" />
            </div>
          )}
          <div className="promotion-copy">
            <span className="eyebrow">FROM THE STORE</span>
            <h2>{promotion.title}</h2>
            <p>{promotion.description}</p>
            <Link className="button button-dark" href={safeInternalUrl(promotion.cta_url)}>
              {promotion.cta_label || "Explore"} <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
