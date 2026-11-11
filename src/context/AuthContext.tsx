"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextValue {
  client: SupabaseClient | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function clearLegacyDemoStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("akira-store-cart-v1");
  window.localStorage.removeItem("akira-store-demo-orders-v1");
  window.sessionStorage.removeItem("akira-store-order-email");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearLegacyDemoStorage();
    if (!configured) {
      setClient(null);
      setUser(null);
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    setClient(supabase);
    if (!supabase) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    void supabase.auth
      .getSession()
      .then(({ data: sessionData }) => setUser(sessionData.session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    return () => data.subscription.unsubscribe();
  }, [configured]);

  const signOut = useCallback(async () => {
    if (client) {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
  }, [client]);

  const value = useMemo(
    () => ({ client, user, loading, configured, signOut }),
    [client, user, loading, configured, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
