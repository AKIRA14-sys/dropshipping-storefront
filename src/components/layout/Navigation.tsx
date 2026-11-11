import Link from "next/link";
import { STORE_CATEGORIES } from "@/data/categories";

export function Navigation({ open = false, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
  return (
    <nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Shop departments">
      <div className="nav-inner">
        <Link href="/" className="nav-home" onClick={onNavigate}>
          Home
        </Link>
        <Link href="/shop" className="nav-all" onClick={onNavigate}>
          Shop all
        </Link>
        {STORE_CATEGORIES.map((category) => (
          <details className="nav-department" key={category.slug}>
            <summary>{category.name}</summary>
            <div className="nav-submenu">
              <Link href={`/categories/${category.slug}`} onClick={onNavigate}>
                All {category.name}
              </Link>
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                  onClick={onNavigate}
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </details>
        ))}
        <Link href="/new-arrivals" onClick={onNavigate}>
          New arrivals
        </Link>
        <Link href="/offers" onClick={onNavigate}>
          Deals & offers
        </Link>
      </div>
    </nav>
  );
}
