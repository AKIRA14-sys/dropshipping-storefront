"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search, ArrowUpRight, Clock3, X } from "lucide-react";
import { STORE_CATEGORIES } from "@/data/categories";

interface Suggestion {
  label: string;
  subline: string;
  href: string;
  kind: "product" | "category" | "recent";
}
const RECENT_KEY = "storefront.recent-searches.v1";

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Suggestion[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = query.trim();

  useEffect(() => {
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
      if (Array.isArray(value))
        setRecent(value.filter((item): item is string => typeof item === "string").slice(0, 6));
    } catch {
      window.localStorage.removeItem(RECENT_KEY);
    }
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setProducts([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as { suggestions?: Suggestion[] };
        setProducts(Array.isArray(payload.suggestions) ? payload.suggestions : []);
      } catch {
        if (!controller.signal.aborted) setProducts([]);
      }
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const categorySuggestions =
    search.length >= 2
      ? STORE_CATEGORIES.filter((category) =>
          `${category.name} ${category.description} ${category.subcategories.map((item) => item.name).join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
          .slice(0, 4)
          .map((category) => ({
            label: category.name,
            subline: "Department",
            href: `/categories/${category.slug}`,
            kind: "category" as const,
          }))
      : [];
  const visible =
    search.length >= 2
      ? [...products, ...categorySuggestions].slice(0, 8)
      : recent.map((term) => ({
          label: term,
          subline: "Recent search",
          href: `/search?q=${encodeURIComponent(term)}`,
          kind: "recent" as const,
        }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search) return;
    const next = [search, ...recent.filter((term) => term.toLowerCase() !== search.toLowerCase())].slice(
      0,
      6,
    );
    setRecent(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(search)}`);
  }
  function clearRecent() {
    setRecent([]);
    window.localStorage.removeItem(RECENT_KEY);
  }

  return (
    <form
      ref={formRef}
      className="header-search"
      action="/search"
      role="search"
      onSubmit={submit}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!formRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Search size={18} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products, brands or keywords"
        aria-label="Search products, brands or keywords"
        aria-autocomplete="list"
        aria-expanded={open && visible.length > 0}
        aria-controls="search-suggestions"
        autoComplete="off"
      />
      {query && (
        <button
          className="clear-search"
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          <X size={15} />
        </button>
      )}
      <button type="submit">Search</button>
      {open && visible.length > 0 && (
        <div
          className="search-suggestions"
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          {!search && recent.length > 0 && (
            <div className="recent-search-tools">
              <span>Recent searches</span>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={clearRecent}>
                Clear history
              </button>
            </div>
          )}
          {visible.map((item) => (
            <Link
              key={`${item.kind}:${item.href}`}
              href={item.href}
              role="option"
              className="search-suggestion"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setOpen(false);
                if (item.kind === "recent") setQuery(item.label);
              }}
            >
              <span className="search-suggestion-icon">
                {item.kind === "recent" ? <Clock3 size={16} /> : <Search size={16} />}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.subline}</small>
              </span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
          {search.length >= 2 && (
            <button className="search-all" type="submit">
              Search all results for “{search}” <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      )}
    </form>
  );
}
