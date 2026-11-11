import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PERSISTENCE_KEY = "storefront.auth.persistence.v1";
let browserClient: SupabaseClient | null = null;

function supabaseUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.hostname === "localhost" ? value : undefined;
  } catch {
    return undefined;
  }
}

export function supabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    undefined
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabasePublicKey());
}

function selectedStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PERSISTENCE_KEY) === "persistent"
    ? window.localStorage
    : window.sessionStorage;
}

const authStorage = {
  getItem(key: string): string | null {
    return selectedStorage()?.getItem(key) ?? null;
  },
  setItem(key: string, value: string): void {
    selectedStorage()?.setItem(key, value);
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export function setAuthPersistence(rememberMe: boolean): void {
  if (typeof window === "undefined") return;
  const from = rememberMe ? window.sessionStorage : window.localStorage;
  const to = rememberMe ? window.localStorage : window.sessionStorage;
  const authKeys = Array.from({ length: from.length }, (_, index) => from.key(index)).filter(
    (key): key is string => Boolean(key?.startsWith("sb-") && key.endsWith("-auth-token")),
  );
  for (const key of authKeys) {
    const value = from.getItem(key);
    if (value !== null) to.setItem(key, value);
    from.removeItem(key);
  }
  window.localStorage.setItem(PERSISTENCE_KEY, rememberMe ? "persistent" : "session");
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl()!, supabasePublicKey()!, {
      auth: {
        storage: authStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

// Server-side catalog access only. It uses the public anon/publishable key and has no user session.
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(supabaseUrl()!, supabasePublicKey()!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://store.example.invalid";
}
