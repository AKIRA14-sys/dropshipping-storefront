import Image from "next/image";
import Link from "next/link";
import { storeName } from "@/config/store";

export function StoreLogo({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`store-logo store-logo-${variant} ${compact ? "store-logo-compact" : ""}`}
      aria-label={`${storeName} home`}
    >
      <Image src="/logo-icon.svg" alt="" width={38} height={38} priority />
      {!compact && <span>{storeName}</span>}
    </Link>
  );
}
