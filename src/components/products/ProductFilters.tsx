"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { CatalogState } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogEmptyState } from "@/components/products/CatalogEmptyState";

function uniqueValues(products: Product[], getter: (product: Product) => string | null) {
  return [...new Set(products.map(getter).filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b),
  );
}
function priceValues(product: Product) {
  return product.variants.length
    ? product.variants.map((variant) => variant.price_ngn ?? product.price_ngn)
    : [product.price_ngn];
}
function hasStock(product: Product) {
  return product.variants.length
    ? product.variants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;
}
const SORTS = ["featured", "newest", "popular", "price-low", "price-high", "name"];

export function ShopBrowser({
  products,
  categories,
  catalogState = "ready",
  initialCategory = "all",
  initialSubcategory = "",
  initialQuery = "",
  initialSort = "featured",
}: {
  products: Product[];
  categories: Category[];
  catalogState?: CatalogState;
  initialCategory?: string;
  initialSubcategory?: string;
  initialQuery?: string;
  initialSort?: string;
}) {
  const currencies = useMemo(
    () => uniqueValues(products, (product) => product.currency_code.toUpperCase()),
    [products],
  );
  const defaultCurrency = currencies.length === 1 ? currencies[0] : "all";
  const initialPrices =
    defaultCurrency === "all"
      ? []
      : products
          .filter((product) => product.currency_code.toUpperCase() === defaultCurrency)
          .flatMap(priceValues);
  const initialMin = initialPrices.length ? Math.floor(Math.min(...initialPrices)) : 0;
  const initialMax = initialPrices.length ? Math.ceil(Math.max(...initialPrices)) : 0;
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [currencyCode, setCurrencyCode] = useState(defaultCurrency);
  const validInitialSort =
    SORTS.includes(initialSort) &&
    !((initialSort === "price-low" || initialSort === "price-high") && defaultCurrency === "all")
      ? initialSort
      : "featured";
  const [sortBy, setSortBy] = useState(validInitialSort);
  const [saleOnly, setSaleOnly] = useState(false);
  const [availability, setAvailability] = useState<"all" | "in-stock" | "out-of-stock">("all");
  const [brand, setBrand] = useState("");
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const brands = useMemo(() => uniqueValues(products, (product) => product.brand), [products]);
  const subcategories = useMemo(
    () =>
      categories.flatMap((item) => (item.slug === category || category === "all" ? item.subcategories : [])),
    [categories, category],
  );
  const attributeFacets = useMemo(() => {
    const values = new Map<string, Set<string>>();
    for (const product of products) {
      const entries: [string, unknown][] = [
        ...Object.entries(product.attributes),
        ...product.variants.flatMap((variant) => Object.entries(variant.options)),
      ];
      for (const [key, raw] of entries) {
        const list = Array.isArray(raw) ? raw : [raw];
        const current = values.get(key) ?? new Set<string>();
        for (const value of list)
          if (value !== null && value !== undefined && String(value).trim()) current.add(String(value));
        values.set(key, current);
      }
    }
    return [...values.entries()]
      .map(([key, valueSet]) => ({ key, values: [...valueSet].sort((a, b) => a.localeCompare(b)) }))
      .filter((facet) => facet.values.length > 1);
  }, [products]);
  const hasSaleProducts = products.some(
    (product) =>
      product.variants.length === 0 &&
      product.compare_at_price_ngn !== null &&
      product.compare_at_price_ngn > product.price_ngn,
  );
  const hasOutOfStock = products.some((product) => !hasStock(product));
  const hasInStock = products.some(hasStock);
  const hasPopularity = products.some((product) => (product.paid_units_sold ?? 0) > 0);
  const filtered = useProducts(products, {
    query,
    category,
    subcategory,
    minPrice,
    maxPrice,
    currencyCode,
    saleOnly,
    availability,
    brand,
    attributes,
    sortBy,
  });
  const selectedCurrencyPrices =
    currencyCode === "all"
      ? []
      : products
          .filter((product) => product.currency_code.toUpperCase() === currencyCode)
          .flatMap(priceValues);
  const selectedCurrencyMaximum = selectedCurrencyPrices.length
    ? Math.ceil(Math.max(...selectedCurrencyPrices))
    : 0;

  function changeCurrency(next: string) {
    setCurrencyCode(next);
    if (next === "all") {
      setMinPrice(0);
      setMaxPrice(0);
      if (sortBy === "price-low" || sortBy === "price-high") setSortBy("featured");
      return;
    }
    const prices = products
      .filter((product) => product.currency_code.toUpperCase() === next)
      .flatMap(priceValues);
    const nextMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
    const nextMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
  }
  function clearFilters() {
    setCategory("all");
    setSubcategory("");
    setQuery("");
    setSaleOnly(false);
    setAvailability("all");
    setBrand("");
    setAttributes({});
    setCurrencyCode(defaultCurrency);
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
    setSortBy(validInitialSort);
  }
  const filterCount =
    Number(category !== "all") +
    Number(Boolean(subcategory)) +
    Number(Boolean(query)) +
    Number(saleOnly) +
    Number(availability !== "all") +
    Number(Boolean(brand)) +
    Object.keys(attributes).length +
    Number(currencyCode !== defaultCurrency) +
    Number(
      currencyCode !== "all" &&
        (minPrice !== (currencyCode === defaultCurrency ? initialMin : 0) ||
          maxPrice !== (currencyCode === defaultCurrency ? initialMax : 0)),
    );
  return (
    <div className="shop-layout">
      <button
        className="mobile-filter-toggle"
        type="button"
        aria-expanded={mobileFiltersOpen}
        aria-controls="product-filters"
        onClick={() => setMobileFiltersOpen((value) => !value)}
      >
        <SlidersHorizontal size={17} /> Filters{filterCount > 0 ? ` (${filterCount})` : ""}
      </button>
      {mobileFiltersOpen && (
        <button
          className="filter-backdrop"
          type="button"
          aria-label="Close filters"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}
      <aside className={`filter-panel ${mobileFiltersOpen ? "filters-open" : ""}`} id="product-filters">
        <div className="filter-heading">
          <h2>
            <SlidersHorizontal size={17} /> Refine
          </h2>
          <button className="text-button" type="button" onClick={clearFilters}>
            Clear all
          </button>
          <button
            className="filter-close"
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          >
            <X size={19} />
          </button>
        </div>
        <label className="filter-label" htmlFor="shop-search">
          Search catalog
        </label>
        <div className="filter-search">
          <Search size={16} />
          <input
            id="shop-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, brand or keyword"
          />
          <button type="button" aria-label="Clear search" onClick={() => setQuery("")} disabled={!query}>
            <X size={14} />
          </button>
        </div>
        <div className="filter-group">
          <h3>Departments</h3>
          <button
            type="button"
            className={`filter-option ${category === "all" ? "selected" : ""}`}
            onClick={() => {
              setCategory("all");
              setSubcategory("");
            }}
          >
            All departments <span>{catalogState === "ready" ? products.length : "—"}</span>
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item.slug}
              className={`filter-option ${category === item.slug ? "selected" : ""}`}
              onClick={() => {
                setCategory(item.slug);
                setSubcategory("");
              }}
            >
              {item.name}
              <span>
                {catalogState === "ready"
                  ? products.filter((product) => product.category_slug === item.slug).length
                  : "—"}
              </span>
            </button>
          ))}
        </div>
        {subcategories.length > 0 && (
          <label className="filter-field">
            <span>Subcategory</span>
            <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
              <option value="">All subcategories</option>
              {subcategories.map((item) => (
                <option key={`${item.slug}-${item.name}`} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {brands.length > 0 && (
          <label className="filter-field">
            <span>Brand</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}
        {currencies.length > 1 && (
          <label className="filter-field">
            <span>Currency</span>
            <select value={currencyCode} onChange={(event) => changeCurrency(event.target.value)}>
              <option value="all">All listed currencies</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        )}
        {currencies.length > 1 && currencyCode === "all" && (
          <p className="currency-filter-note">
            Choose a currency to set a price range. No currency conversion is applied.
          </p>
        )}
        {currencyCode !== "all" && (
          <div className="filter-group">
            <h3>Price range · {currencyCode}</h3>
            <div className="price-inputs">
              <label>
                <span>From</span>
                <input
                  aria-label={`Minimum price in ${currencyCode}`}
                  type="number"
                  min={0}
                  max={selectedCurrencyMaximum}
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(Math.min(selectedCurrencyMaximum, Math.max(0, Number(event.target.value))))
                  }
                />
              </label>
              <label>
                <span>To</span>
                <input
                  aria-label={`Maximum price in ${currencyCode}`}
                  type="number"
                  min={minPrice}
                  max={selectedCurrencyMaximum}
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      Math.max(minPrice, Math.min(selectedCurrencyMaximum, Number(event.target.value))),
                    )
                  }
                />
              </label>
            </div>
            <small>Price values use the selected product currency; no exchange conversion.</small>
          </div>
        )}
        {hasSaleProducts && (
          <label className="check-filter">
            <input
              type="checkbox"
              checked={saleOnly}
              onChange={(event) => setSaleOnly(event.target.checked)}
            />
            <span>Current offers</span>
          </label>
        )}
        {(hasInStock || hasOutOfStock) && (
          <label className="filter-field">
            <span>Availability</span>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value as typeof availability)}
            >
              <option value="all">All availability</option>
              {hasInStock && <option value="in-stock">In stock</option>}
              {hasOutOfStock && <option value="out-of-stock">Out of stock</option>}
            </select>
          </label>
        )}
        {attributeFacets.map((facet) => (
          <label className="filter-field" key={facet.key}>
            <span>
              {facet.key.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase())}
            </span>
            <select
              value={attributes[facet.key] ?? ""}
              onChange={(event) =>
                setAttributes((current) => ({ ...current, [facet.key]: event.target.value }))
              }
            >
              <option value="">All</option>
              {facet.values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </aside>
      <section className="catalogue" aria-label="Product results">
        <div className="catalogue-toolbar">
          <p>
            <strong>{filtered.length}</strong> product{filtered.length === 1 ? "" : "s"}
            {query && (
              <>
                {" "}
                for <strong>“{query}”</strong>{" "}
                <button
                  className="clear-query"
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={13} />
                </button>
              </>
            )}
          </p>
          <label className="sort-label">
            Sort by{" "}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              {hasPopularity && <option value="popular">Best sellers</option>}
              {currencyCode !== "all" && (
                <>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </>
              )}
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        {catalogState !== "ready" ? (
          <CatalogEmptyState state={catalogState} />
        ) : filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Search size={24} />
            </span>
            <h2>No products match these filters.</h2>
            <p>Try a different keyword or remove one of your filters.</p>
            <button className="button button-dark" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
        <div className="catalogue-help">
          Need a hand? <Link href="/contact">Contact the store</Link>
        </div>
      </section>
    </div>
  );
}
