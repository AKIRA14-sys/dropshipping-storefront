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
import { lineAvailableStock, linePrice } from "@/lib/cart-utils";
import type { CartLine } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

type CartVerification = "checking" | "verified" | "unavailable" | "not-configured";
interface StoredCartRow {
  productId: string;
  variantId: string | null;
  quantity: number;
}
interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  currencySubtotals: { currencyCode: string; amount: number }[];
  verification: CartVerification;
  syncError: boolean;
  removedCount: number;
  adjustedCount: number;
  addItem: (product: Product, quantity?: number, selectedVariant?: ProductVariant | null) => Promise<boolean>;
  setQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const GUEST_KEY = "storefront.cart.guest.v1";
const USER_KEY_PREFIX = "storefront.cart.user.v1.";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function userKey(userId: string) {
  return `${USER_KEY_PREFIX}${userId}`;
}

function rowKey(row: StoredCartRow) {
  return `${row.productId}:${row.variantId ?? "default"}`;
}

function mergeRows(...groups: StoredCartRow[][]): StoredCartRow[] {
  const merged = new Map<string, StoredCartRow>();
  for (const row of groups.flat()) {
    const key = rowKey(row);
    const current = merged.get(key);
    merged.set(key, {
      ...row,
      quantity: Math.min(20, (current?.quantity ?? 0) + row.quantity),
    });
  }
  return [...merged.values()];
}

function mergeMirrors(...groups: StoredCartRow[][]): StoredCartRow[] {
  const merged = new Map<string, StoredCartRow>();
  for (const row of groups.flat()) {
    const key = rowKey(row);
    const current = merged.get(key);
    merged.set(key, { ...row, quantity: Math.max(current?.quantity ?? 0, row.quantity) });
  }
  return [...merged.values()];
}

function readRows(key: string): StoredCartRow[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
    if (!Array.isArray(parsed)) throw new Error("Invalid saved cart");
    const rows: StoredCartRow[] = [];
    for (const value of parsed) {
      if (!value || typeof value !== "object") continue;
      const row = value as Record<string, unknown>;
      if (typeof row.productId !== "string" || !UUID_PATTERN.test(row.productId)) continue;
      if (
        row.variantId !== null &&
        row.variantId !== undefined &&
        (typeof row.variantId !== "string" || !UUID_PATTERN.test(row.variantId))
      )
        continue;
      if (!Number.isInteger(row.quantity) || Number(row.quantity) < 1 || Number(row.quantity) > 20) continue;
      rows.push({
        productId: row.productId,
        variantId: typeof row.variantId === "string" ? row.variantId : null,
        quantity: Number(row.quantity),
      });
    }
    return mergeRows(rows);
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

function materialize(rows: StoredCartRow[], products: Product[]) {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines: CartLine[] = [];
  let removedCount = 0;
  let adjustedCount = 0;
  for (const row of rows) {
    const product = productMap.get(row.productId);
    const variant = row.variantId
      ? product?.variants.find((candidate) => candidate.id === row.variantId)
      : undefined;
    if (!product || (row.variantId && !variant) || (product.variants.length > 0 && !variant)) {
      removedCount += 1;
      continue;
    }
    const variantStock = variant?.stock_quantity;
    const stock = variantStock ?? product.stock_quantity;
    if (stock <= 0) {
      removedCount += 1;
      continue;
    }
    const quantity = Math.min(row.quantity, 20, stock);
    if (quantity < row.quantity) adjustedCount += 1;
    const optionLabel = variant
      ? variant.label || Object.values(variant.options).filter(Boolean).join(" · ") || "Selected option"
      : null;
    lines.push({
      product,
      quantity,
      variantId: variant?.id ?? null,
      variantKey: variant?.id ?? "default",
      variantLabel: optionLabel,
    });
  }
  return { lines, removedCount, adjustedCount };
}

function rowsFromLines(lines: CartLine[]): StoredCartRow[] {
  return lines.map((line) => ({
    productId: line.product.id,
    variantId: line.variantId,
    quantity: line.quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { client, user, loading: authLoading, configured } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [hydratedFor, setHydratedFor] = useState<string | null | undefined>(undefined);
  const [verification, setVerification] = useState<CartVerification>("checking");
  const [syncError, setSyncError] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);
  const [adjustedCount, setAdjustedCount] = useState(0);
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
    setAdjustedCount(0);

    async function loadCart() {
      if (!configured || !client) {
        if (!cancelled) {
          setVerification("not-configured");
          setHydratedFor(user?.id ?? null);
          setReady(true);
        }
        return;
      }
      try {
        const ownRows = readRows(user ? userKey(user.id) : GUEST_KEY);
        const guestRows = user ? readRows(GUEST_KEY) : [];
        let remoteRows: StoredCartRow[] = [];
        if (user) {
          const { data, error } = await client
            .from("cart_items")
            .select("product_id,variant_id,quantity")
            .eq("user_id", user.id);
          if (error) throw error;
          remoteRows = (data ?? [])
            .map((row) => ({
              productId: row.product_id as string,
              variantId: (row.variant_id as string | null) ?? null,
              quantity: Number(row.quantity),
            }))
            .filter(
              (row) =>
                UUID_PATTERN.test(row.productId) &&
                (!row.variantId || UUID_PATTERN.test(row.variantId)) &&
                Number.isInteger(row.quantity) &&
                row.quantity >= 1 &&
                row.quantity <= 20,
            );
        }
        const storedRows = mergeRows(mergeMirrors(ownRows, remoteRows), guestRows);
        const freshProducts = await verifyProducts([...new Set(storedRows.map((row) => row.productId))]);
        if (cancelled) return;
        const result = materialize(storedRows, freshProducts);
        setItems(result.lines);
        setRemovedCount(result.removedCount);
        setAdjustedCount(result.adjustedCount);
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
    void loadCart();
    return () => {
      cancelled = true;
    };
  }, [authLoading, client, configured, user?.id]);

  useEffect(() => {
    const ownerId = user?.id ?? null;
    if (!ready || verification !== "verified" || hydratedFor !== ownerId || typeof window === "undefined")
      return;
    const rows = rowsFromLines(items);
    try {
      window.localStorage.setItem(user ? userKey(user.id) : GUEST_KEY, JSON.stringify(rows));
    } catch {
      setSyncError(true);
    }
    if (!user || !client || syncAllowedFor.current !== user.id) return;

    let cancelled = false;
    async function syncCart() {
      if (rows.length) {
        const records = rows.map((row) => ({
          user_id: user!.id,
          product_id: row.productId,
          variant_id: row.variantId,
          variant_key: row.variantId ?? "default",
          quantity: row.quantity,
        }));
        const { error } = await client!
          .from("cart_items")
          .upsert(records, { onConflict: "user_id,product_id,variant_key" });
        if (error) throw error;
      }
      const { data: current, error: readError } = await client!
        .from("cart_items")
        .select("id,product_id,variant_key")
        .eq("user_id", user!.id);
      if (readError) throw readError;
      const active = new Set(rows.map(rowKey));
      const staleIds = (current ?? [])
        .filter((row) => !active.has(`${row.product_id}:${row.variant_key}`))
        .map((row) => row.id as string);
      if (staleIds.length) {
        const { error } = await client!
          .from("cart_items")
          .delete()
          .eq("user_id", user!.id)
          .in("id", staleIds);
        if (error) throw error;
      }
      if (!cancelled) {
        setSyncError(false);
        window.localStorage.removeItem(GUEST_KEY);
      }
    }
    void syncCart().catch(() => {
      if (!cancelled) setSyncError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [items, ready, verification, hydratedFor, user?.id, client]);

  const addItem = useCallback(
    async (product: Product, quantity = 1, selectedVariant: ProductVariant | null = null) => {
      if (!ready || verification !== "verified") return false;
      if (
        product.variants.length > 0 &&
        (!selectedVariant || !product.variants.some((variant) => variant.id === selectedVariant.id))
      )
        return false;
      const requestedVariantId = selectedVariant?.id ?? null;
      const desiredQuantity = Math.max(1, Math.min(20, Math.floor(quantity) || 1));
      const proposed = mergeRows(rowsFromLines(items), [
        { productId: product.id, variantId: requestedVariantId, quantity: desiredQuantity },
      ]);
      setVerification("checking");
      try {
        const freshProducts = await verifyProducts([...new Set(proposed.map((row) => row.productId))]);
        const result = materialize(proposed, freshProducts);
        const added = result.lines.some(
          (line) => line.product.id === product.id && line.variantId === requestedVariantId,
        );
        setItems(result.lines);
        setRemovedCount(result.removedCount);
        setAdjustedCount(result.adjustedCount);
        setVerification("verified");
        return added;
      } catch {
        setVerification("unavailable");
        setSyncError(true);
        return false;
      }
    },
    [items, ready, verification],
  );

  const setQuantity = useCallback((productId: string, quantity: number, variantId: string | null = null) => {
    setItems((current) => {
      if (quantity <= 0)
        return current.filter((line) => !(line.product.id === productId && line.variantId === variantId));
      return current.map((line) => {
        if (line.product.id !== productId || line.variantId !== variantId) return line;
        const stock = lineAvailableStock(line);
        return { ...line, quantity: Math.min(20, stock, Math.max(1, Math.floor(quantity))) };
      });
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems((current) =>
      current.filter(
        (line) => line.product.id !== productId || (variantId !== undefined && line.variantId !== variantId),
      ),
    );
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const currencySubtotals =
    verification === "verified"
      ? [
          ...items.reduce((totals, line) => {
            const currencyCode = line.product.currency_code.toUpperCase();
            totals.set(currencyCode, (totals.get(currencyCode) ?? 0) + line.quantity * linePrice(line));
            return totals;
          }, new Map<string, number>()),
        ]
          .map(([currencyCode, amount]) => ({ currencyCode, amount }))
          .sort((a, b) => a.currencyCode.localeCompare(b.currencyCode))
      : [];
  const value = useMemo(
    () => ({
      items,
      itemCount,
      currencySubtotals,
      verification,
      syncError,
      removedCount,
      adjustedCount,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      currencySubtotals,
      verification,
      syncError,
      removedCount,
      adjustedCount,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
