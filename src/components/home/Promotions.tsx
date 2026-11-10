import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Promotions() {
  return (
    <section className="story-band section-wrap">
      <div className="story-mark">A</div>
      <div>
        <span className="eyebrow">A NOTE FROM US</span>
        <h2>
          Shopping should feel
          <br />
          like finding a little joy.
        </h2>
        <p>We’re building a thoughtful corner for the things that make everyday life a touch brighter.</p>
      </div>
      <Link href="/about" className="button button-outline">
        Get to know us <ArrowRight size={16} />
      </Link>
    </section>
  );
}
