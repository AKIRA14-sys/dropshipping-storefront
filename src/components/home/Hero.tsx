import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, PackageCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="hero section-wrap">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={14} /> LITTLE THINGS, LOVELY FINDS
        </span>
        <h1>
          Find your
          <br />
          <em>everyday</em> favourite.
        </h1>
        <p>Thoughtful little picks for your skin, your style, your space and everything in between.</p>
        <div className="hero-actions">
          <Link href="/shop" className="button button-dark">
            Explore the shop <ArrowRight size={17} />
          </Link>
          <span className="hero-subtext">A brighter kind of browsing.</span>
        </div>
        <div className="hero-proof">
          <span>
            <span className="proof-icon">
              <PackageCheck size={17} />
            </span>
            Easy browsing
          </span>
          <span>
            <span className="proof-icon">
              <Heart size={17} />
            </span>
            Picked with care
          </span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo">
          <Image
            src="/images/skincare-hero.jpg"
            alt="Illustrative skincare bottles in warm light"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 56vw"
            className="hero-img"
          />
        </div>
        <div className="hero-sticker">
          <span>
            THE GOOD
            <br />
            FIND EDIT
          </span>
          <ArrowUpRight size={18} />
        </div>
        <div className="hero-caption">
          <span>01 — YOUR LITTLE MOMENT</span>
          <span>BEAUTY · STYLE · HOME</span>
        </div>
        <div className="hero-float-note">
          <span className="note-star">✳</span>
          <span>
            Good things
            <br />
            for your day
          </span>
        </div>
      </div>
    </section>
  );
}
