import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="hero section-wrap">
      <div className="hero-copy">
        <span className="eyebrow">FOUR DEPARTMENTS · ONE EASY SHOP</span>
        <h1>
          Good finds for <em>everyday life.</em>
        </h1>
        <p>Explore fashion, anime and collectibles, school supplies, and home appliances—at your own pace.</p>
        <div className="hero-actions">
          <Link href="/shop" className="button button-dark">
            Explore the shop <ArrowRight size={17} />
          </Link>
          <Link href="#departments" className="text-link">
            Browse departments <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="hero-proof">
          <span>Browse without an account</span>
          <span>Save your picks for later</span>
        </div>
      </div>
      <div
        className="hero-visual hero-visual-categories"
        aria-label="Illustrations representing the store departments"
      >
        <div className="hero-photo">
          <Image
            src="/categories/fashion.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
            className="hero-img"
          />
        </div>
        <div className="hero-art-card hero-art-anime">
          <Image src="/categories/anime.svg" alt="" fill sizes="180px" />
        </div>
        <div className="hero-art-card hero-art-school">
          <Image src="/categories/school-supplies.svg" alt="" fill sizes="180px" />
        </div>
        <div className="hero-caption">
          <span>FASHION · COLLECTIBLES · SCHOOL · HOME</span>
          <span>ILLUSTRATIONS, NOT PRODUCT PHOTOS</span>
        </div>
      </div>
    </section>
  );
}
