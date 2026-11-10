import Link from "next/link";

const links = [
  { label: "Beauty", href: "/categories/beauty" },
  { label: "Fashion", href: "/categories/fashion" },
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Home & living", href: "/categories/home-living" },
];

export function Navigation({ open = false, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
  return (
    <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Shop departments">
      <div className="nav-inner">
        <Link href="/shop" className="nav-all" onClick={onNavigate}>
          Shop all
        </Link>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={onNavigate}>
            {link.label}
          </Link>
        ))}
        <Link href="/about" className="nav-about" onClick={onNavigate}>
          Our story
        </Link>
      </div>
    </nav>
  );
}
