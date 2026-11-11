"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { verifyProducts } from "@/lib/catalog-browser";
import type { Product } from "@/types/product";

type WishlistVerification = "checking" | "verified" | "unavailable" | "not-configured";
interface WishlistContextValue {
  items: Product[];
  count: number;
  verification: WishlistVerification;
  syncError: boolean;
  removedCount: number;
  toggle: (product: Product) => boolean;
  isSaved: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const GUEST_KEY = "storefront.wishlist.guest.v1";
const USER_KEY_PREFIX = "storefront.wishlist.user.v1.";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function userKey(userId: string) {
  return `${USER_KEY_PREFIX}${userId}`;
}

function readIds(key: string): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
    if (!Array.isArray(value)) throw new Error("Invalid saved wishlist");
    return [...new Set(value.filter((id): id is string => typeof id === "string" && uuidPattern.test(id)))];
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { client, user, loading: authLoading, configured } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [hydratedFor, setHydratedFor] = useState<string | null | undefined>(undefined);
  const [verification, setVerification] = useState<WishlistVerification>("checking");
  const [syncError, setSyncError] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);
  const syncAllowedFor = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    syncAllowedFor.current = null;
    setReady(false);
    setItems([]);
    setVerification("checking");
    setSyncError(false);
    setRemovedCount(0);

    async function load() {
      if (!configured || !client) {
        if (!cancelled) {
          setVerification("not-configured");
          setHydratedFor(user?.id ?? null);
          setReady(true);
        }
        return;
      }
      try {
        const localIds = user ? readIds(userKey(user.id)) : readIds(GUEST_KEY);
        const guestIds = user ? readIds(GUEST_KEY) : [];
        let remoteIds: string[] = [];
        if (user) {
          const { data, error } = await client
            .from("wishlist_items")
            .select("product_id")
            .eq("user_id", user.id);
          if (error) throw error;
          remoteIds = (data ?? []).map((row) => row.product_id as string);
        }
        const allIds = [...new Set([...localIds, ...guestIds, ...remoteIds])];
        const products = await verifyProducts(allIds);
        if (cancelled) return;
        const validIds = new Set(products.map((product) => product.id));
        setItems(products);
        setRemovedCount(allIds.filter((id) => !validIds.has(id)).length);
        setVerification("verified");
        setHydratedFor(user?.id ?? null);
        setReady(true);
        if (user) syncAllowedFor.current = user.id;
      } catch {
        if (!cancelled) {
          setItems([]);
          setVerification("unavailable");
          setSyncError(Boolean(user));
          setHydratedFor(user?.id ?? null);
          setReady(true);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, client, configured, user?.id]);

  useEffect(() => {
    const ownerId = user?.id ?? null;
    if (!ready || verification !== "verified" || hydratedFor !== ownerId || typeof window === "undefined")
      return;
    const ids = items.map((item) => item.id);
    window.localStorage.setItem(user ? userKey(user.id) : GUEST_KEY, JSON.stringify(ids));
    if (!user || !client || syncAllowedFor.current !== user.id) return;

    let cancelled = false;
    async function syncWishlist() {
      const records = ids.map((productId) => ({ user_id: user!.id, product_id: productId }));
      if (records.length) {
        const { error } = await client!
          .from("wishlist_items")
          .upsert(records, { onConflict: "user_id,product_id" });
        if (error) throw error;
      }
      const { data: current, error: readError } = await client!
        .from("wishlist_items")
        .select("id,product_id")
        .eq("user_id", user!.id);
      if (readError) throw readError;
      const active = new Set(ids);
      const removeIds = (current ?? []).filter((row) => !active.has(row.product_id)).map((row) => row.id);
      if (removeIds.length) {
        const { error } = await client!
          .from("wishlist_items")
          .delete()
          .eq("user_id", user!.id)
          .in("id", removeIds);
        if (error) throw error;
      }
      if (!cancelled) {
        setSyncError(false);
        window.localStorage.removeItem(GUEST_KEY);
      }
    }
    void syncWishlist().catch(() => {
      if (!cancelled) setSyncError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [items, ready, verification, hydratedFor, user?.id, client]);

  const toggle = useCallback(
    (product: Product) => {
      if (verification !== "verified") return false;
      setItems((current) =>
        current.some((item) => item.id === product.id)
          ? current.filter((item) => item.id !== product.id)
          : [...current, product],
      );
      return true;
    },
    [verification],
  );
  const remove = useCallback(
    (productId: string) => setItems((current) => current.filter((item) => item.id !== productId)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);
  const isSaved = useCallback((productId: string) => items.some((item) => item.id === productId), [items]);
  const value = useMemo(
    () => ({
      items,
      count: items.length,
      verification,
      syncError,
      removedCount,
      toggle,
      isSaved,
      remove,
      clear,
    }),
    [items, verification, syncError, removedCount, toggle, isSaved, remove, clear],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
