"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/data/demo-products";
import { useProducts } from "@/hooks/useProducts";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";

export function ShopBrowser({
  products,
  categories = CATEGORIES,
  initialCategory = "all",
  initialQuery = "",
}: {
  products: Product[];
  categories?: Category[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [saleOnly, setSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);
  const filtered = useProducts(products, { query, category, saleOnly, maxPrice, sortBy });
  const clearFilters = () => {
    setCategory("all");
    setQuery("");
    setSaleOnly(false);
    setMaxPrice(100000);
    setSortBy("featured");
  };

  return (
    <div className="shop-layout">
      <aside className="filter-panel">
        <div className="filter-heading">
          <h2>
            <SlidersHorizontal size={17} /> Filters
          </h2>
          <button className="text-button" onClick={clearFilters}>
            Clear
          </button>
        </div>
        <label className="filter-label" htmlFor="shop-search">
          Search
        </label>
        <div className="filter-search">
          <Search size={16} />
          <input
            id="shop-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
          />
        </div>
        <div className="filter-group">
          <h3>Departments</h3>
          <button
            className={`filter-option ${category === "all" ? "selected" : ""}`}
            onClick={() => setCategory("all")}
          >
            All products <span>{products.length}</span>
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              className={`filter-option ${category === item.slug ? "selected" : ""}`}
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
              <span>{products.filter((product) => product.category_slug === item.slug).length}</span>
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label htmlFor="max-price">
            <h3>
              Price up to <span className="filter-price">₦{maxPrice.toLocaleString("en-NG")}</span>
            </h3>
          </label>
          <input
            id="max-price"
            className="price-range"
            type="range"
            min="10000"
            max="100000"
            step="5000"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>₦10k</span>
            <span>₦100k</span>
          </div>
        </div>
        <label className="check-filter">
          <input type="checkbox" checked={saleOnly} onChange={(event) => setSaleOnly(event.target.checked)} />
          <span>On offer</span>
        </label>
      </aside>
      <section className="catalogue" aria-label="Product results">
        <div className="catalogue-toolbar">
          <p>
            <strong>{filtered.length}</strong> lovely find{filtered.length === 1 ? "" : "s"}
            {query && (
              <>
                {" "}
                for <strong>“{query}”</strong>{" "}
                <button className="clear-query" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={13} />
                </button>
              </>
            )}
          </p>
          <label className="sort-label">
            Sort by{" "}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Search size={24} />
            </span>
            <h2>No finds just yet</h2>
            <p>Try another search or clear a filter to see more.</p>
            <button className="button button-dark" onClick={clearFilters}>
              Show all products
            </button>
          </div>
        )}
        <div className="catalogue-help">
          Need a hand? <Link href="/faq">Visit our FAQs</Link>
        </div>
      </section>
    </div>
  );
}
