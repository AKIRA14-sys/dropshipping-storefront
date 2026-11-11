# NEXTVO — multi-category storefront

NEXTVO is a responsive, app-style shopping storefront built with Next.js, React, TypeScript, Supabase and Vercel. Its visual direction follows the supplied reference: dark glass surfaces, compact product cards, blue-violet accents, a searchable header, a department drawer on desktop/mobile and a four-destination bottom bar on phones.

The catalog starts with 14 departments—Phones & Mobile Devices, Computers & Laptops, Gaming, Electronics, Home Appliances, Fashion & Clothing, Beauty/Skincare/Personal Care, Anime & Collectibles, School & Office Supplies, Sports & Outdoor, Toys/Kids/Baby, Home/Furniture/Living, Automotive Accessories, and Travel & Lifestyle. Department and subcategory records are database-driven; owners can add more departments without changing a closed TypeScript union.

## Current status

The source project is in the existing GitHub repository, but live Supabase and Vercel services have not been connected from this workspace. No sample products, prices, reviews, stock, or sales are seeded. Product cards and product detail pages appear only for active owner-published catalog records. Categories remain browsable while empty, with a distinct message for an unconfigured catalog, a failed catalog request, and a genuinely empty inventory.

Customers can explore as guests, keep a device-based cart and wishlist, or use Supabase Auth for an account whose profile, saved addresses, cart, wishlist, and private order history are protected by row-level security. Wishlist lives alongside the bag in the Cart destination. **Checkout is intentionally closed:** no delivery form is collected, no order is created, and no payment is taken. The payment provider, verified server-side order flow, fulfillment tools, store-admin dashboard, customer emails, delivery rules and final legal policies are not connected yet.

The supplied photographs are used only as category artwork where configured; they are never treated as a product listing. Real product photos, prices, stock, variants, descriptions, supplier details, promotions, shipping terms and support contact must be supplied and verified by the store owner.

## Project structure

```text
public/                          NEXTVO logo variants, favicon and category artwork
src/app/                         Home, Explore, category, product, account and API routes
src/components/layout/           Header search, department drawer, logo, footer and mobile nav
src/components/home/             Live-product spotlight, departments and catalog collections
src/components/categories/       Department artwork and visual fallbacks
src/components/products/         Product cards, filters, gallery, wishlist and purchase controls
src/components/cart/             Combined cart/wishlist views and paused checkout preview
src/components/account/          Protected profile, addresses and private order history
src/context/                     Auth, cart and wishlist state
src/hooks/                       Cart and catalog-filter hooks
src/lib/                          Supabase, live product/category queries, SEO and price helpers
src/data/                         Offline category presentation fallback; no product inventory
src/config/                       NEXTVO identity, currency and optional public links
supabase/migrations/              Seven ordered schema/security migrations
supabase/seed.sql                 14 departments and subcategories only
```

## Run and verify locally

Requires Node.js 20.9 or later and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The site can be previewed without Supabase; the catalog then remains empty and no fake listings are shown. Before publishing changes, run:

```bash
npm run format:check
npm run typecheck
npm audit
npm run build
```

These checks run against the local source. They do not prove that the remote Supabase/Vercel services are connected. GitHub Actions is not currently configured for this repository.

## Supabase setup

1. Create/select the store's Supabase project. In the SQL Editor, apply every file in `supabase/migrations/` in numerical order, from `001_create_categories.sql` through `007_scalable_department_taxonomy.sql`. Then run `supabase/seed.sql`. The seed creates only the 14 departments and their subcategories—no products, inventory, promotions, reviews, orders or customer data. Migration 007 upgrades the existing four category records without changing their IDs, adds category artwork URLs, and keeps straightforward legacy category links working through Next.js redirects.
2. In **Project Settings → API**, copy the project URL and anon/publishable key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). These are public client values. Never add a Supabase service-role key to a `NEXT_PUBLIC_` variable, this repository or the browser.
3. In **Authentication → URL Configuration**, set the deployed site URL and the production/preview URLs that you use. Enable email OTP and password sign-in, configure the email template to deliver a six-digit verification code, then test sign-up, sign-in, recovery, Remember me, sign-out, account isolation and saved-item sync.
4. Add a product only when the owner has accurate current price/currency, stock, options, variants, category/subcategory, product attributes, permitted photos and verified description. Upload actual product photos to the `product-images` bucket in Supabase Storage; shoppers have read-only access. Set featured/new-arrival flags and promotions only when deliberate and current.
5. Use a separate Supabase test project to verify public catalog reads, search/filter results, image display and private account data. Customer profiles, addresses, carts, wishlists, orders and order items are protected by `auth.uid()`-based RLS. The original public order-creation and email/tracking RPCs have been revoked and removed.

### Orders and payments

The order API responds with `410 Gone`; the checkout UI is informational and cannot create an order. No payment provider, payment verification, webhook, fulfillment automation, admin inventory tool or live order-confirmation email is connected. Do not represent a manual database row as a paid order. A later payment/order implementation requires a separately reviewed, server-side flow that verifies provider status before marking any order as paid.

## Vercel deployment

The existing source repository is [AKIRA14-sys/dropshipping-storefront](https://github.com/AKIRA14-sys/dropshipping-storefront). To deploy from a phone browser:

1. In Vercel, choose **Add New → Project → Import Git Repository** and select `AKIRA14-sys/dropshipping-storefront`.
2. Keep the detected framework as **Next.js**, root directory `./`, and production branch `main`.
3. Add the public environment values from `.env.example`, including the confirmed store name **NEXTVO**, currency and public Supabase values. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS production domain.
4. Deploy and check Home, Explore, department, search, product, account, Cart/Wishlist, checkout-preview, help and mobile-navigation routes. Verify catalog errors fail closed and checkout remains closed.
5. Leave `NEXT_PUBLIC_INDEXING_ENABLED=false` until the live catalog, customer policies and production domain are ready. Enable it only with a real HTTPS `NEXT_PUBLIC_SITE_URL`; the code rejects placeholder and local hosts. Add Google verification only after Search Console setup.

This workspace has not linked a Vercel project or deployed a public website. Production service connection remains an owner account action.

## Brand, currency and editing

- **NEXTVO** is the confirmed brand. It can be changed later with `NEXT_PUBLIC_STORE_NAME`.
- `StoreLogo` and the matching SVGs (`public/logo.svg`, `logo-dark.svg`, `logo-light.svg`, `logo-icon.svg`, and `favicon.svg`) share the custom geometric mark and blue-violet palette.
- `NEXT_PUBLIC_STORE_CURRENCY` sets a store default; each product price uses its own stored ISO currency code. Mixed-currency bags show separate subtotals without conversion.
- Set `NEXT_PUBLIC_SUPPORT_EMAIL` only to an inbox the owner controls. Contact pages do not claim to submit an unconnected form.
- Optional Instagram, TikTok and Facebook links appear only when an owner supplies a valid HTTPS profile URL.
- Newsletter and customer reviews remain omitted until an email service and moderation/data process are configured.

The repository is the permanent source of truth. Use the GitHub Android app or mobile website to browse and edit TypeScript, CSS, SVG, SQL and Markdown. Do not commit credentials or private customer data. See [`docs/launch-checklist.md`](docs/launch-checklist.md) and `tests/` for the remaining owner checks.
