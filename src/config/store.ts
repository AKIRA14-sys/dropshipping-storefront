export const storeName = process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "NEXTVO";
export const storeCurrency = process.env.NEXT_PUBLIC_STORE_CURRENCY?.trim() || "NGN";
export const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";

function publicSocialUrl(value: string | undefined): string | null {
  try {
    const url = new URL(value || "");
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const socialLinks = [
  { label: "Instagram", href: publicSocialUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
  { label: "TikTok", href: publicSocialUrl(process.env.NEXT_PUBLIC_TIKTOK_URL) },
  { label: "Facebook", href: publicSocialUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
].filter((item): item is { label: string; href: string } => Boolean(item.href));

export const storeDescription =
  "Explore phones, tech, fashion, beauty, home, gaming and more at NEXTVO. Browse current published listings and save your finds.";

export function canIndexSite(): boolean {
  if (process.env.NEXT_PUBLIC_INDEXING_ENABLED !== "true") return false;
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !host) return false;
    if (["localhost", "127.0.0.1", "::1"].includes(host)) return false;
    if ([".example", ".invalid", ".test"].some((suffix) => host.endsWith(suffix))) return false;
    return true;
  } catch {
    return false;
  }
}
