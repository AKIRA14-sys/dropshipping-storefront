# Your Store — multi-category storefront

A mobile-first Next.js storefront for **Fashion**, **Anime & Collectibles**, **School Supplies**, and **Home Appliances**. “Your Store” is a temporary brand name; change it with `NEXT_PUBLIC_STORE_NAME` after the owner confirms the final identity.

## Current status

The customer-facing source is built, but the live Supabase and Vercel projects have not been connected from this workspace. The catalog contains no sample products: it displays only owner-published database listings and otherwise shows a clear setup or empty state. The included seed creates the four approved departments and their subcategories only.

Customers can browse without signing in, save a device-based bag and wishlist, or—after Supabase Auth is configured—create an account with a six-digit email verification code and password. Saved account data is protected by row-level security. **Checkout is intentionally closed:** this repository has no payment gateway or order-submission flow, does not collect checkout delivery details, and cannot accept or confirm an order. Newsletter sign-up is not shown until a real email service is configured. There is no store-admin dashboard yet.

The supplied category artwork is original vector illustration, not a product listing. Product photos, prices, options, stock, supplier details, promotions, shipping terms, returns, customer-support contact and the final brand must be supplied and verified by the store owner.

## Project structure

```text
public/                         Logos, favicon and original department illustrations
src/app/                        Storefront, account, information and API routes
src/components/layout/          Responsive header, search, navigation, logo and footer
src/components/home/            Editorial home, department cards, collections and spotlight
src/components/products/        Product cards, filters, gallery, wishlist and purchase panel
src/components/cart/             Guest/account bag and paused checkout experience
src/components/account/          Protected profile, addresses and private order history
src/context/                     Auth, bag and wishlist state
src/hooks/                       Cart and catalog-filter hooks
src/lib/                         Live catalog queries, Supabase clients, SEO and pricing helpers
src/types/                       Product, department and saved-address types
src/data/                         Owner-approved department taxonomy only
src/config/                       Replaceable store identity and optional public links
supabase/migrations/             Six ordered schema/security migrations
supabase/seed.sql                 Four departments and subcategories; no product rows
public/categories/                Original vector department illustrations
```

## Run and verify locally

Requires Node.js 20.9 or later and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The catalog stays empty until a Supabase project with real published product rows is configured. Before publishing changes, run:

```bash
npm run format:check
npm run typecheck
npm audit
npm run build
```

These commands have been run in the cloud workspace; they do not prove that the remote Supabase/Vercel services are connected. This repository currently has no active GitHub Actions workflow, so the checks above should be run locally after source changes.

## Supabase setup

1. Create or select the store’s Supabase project. In the SQL Editor, run every file in `supabase/migrations/` in numerical order, from `001_create_categories.sql` through `006_search_and_account_hardening.sql`. Then run `supabase/seed.sql` once. The seed inserts only the four department/category taxonomies—no products, inventory, promotions, reviews, orders or customer data.
2. In **Project Settings → API**, copy the project URL and anon/publishable key. Add them as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) in the deployment environment. These are public client values; **never** put a service-role key in a `NEXT_PUBLIC_` variable, in this repository, or in the browser.
3. In **Authentication → URL Configuration**, set the deployed site URL and add the production and preview URLs that you actually use. Enable email/OTP sign-in and configure the email template to deliver a six-digit verification token. Test registration, password creation, sign-in, recovery, sign-out, cart/wishlist sync and address isolation with test accounts.
4. Add products only when the owner has accurate listings, current prices/currency, available stock, variants/options, department/subcategory, product attributes, licensed images and verified descriptions. Upload actual product photos to the `product-images` bucket using the Supabase dashboard; the public policy is read-only for shoppers. Set `featured` and `is_new_arrival` only for items the store owner has deliberately selected. Create promotions only when their dates, details and destination are real.
5. Test public catalog reads and account-owned data using separate test accounts. Orders and order items are readable only by their authenticated owner; customer profiles, addresses, carts and wishlists have RLS. Default-address updates use an ownership-checked database function. The public order-creation and email/tracking lookup functions from the original schema are revoked and removed.

### Important: orders and payments

The order API responds with `410 Gone`; the checkout UI is informational and cannot create an order. There is no payment provider, payment verification, webhooks, fulfillment automation, admin inventory tool or live order-confirmation email. Do not open checkout or represent a manual database row as a paid order. A later payment/order implementation needs a separate security-reviewed server-side flow that confirms provider status before marking an order paid.

## Vercel deployment

The GitHub repository is public at [AKIRA14-sys/dropshipping-storefront](https://github.com/AKIRA14-sys/dropshipping-storefront). To deploy it from a phone browser:

1. In Vercel, choose **Add New → Project → Import Git Repository** and select `AKIRA14-sys/dropshipping-storefront`.
2. Keep the detected framework as **Next.js**, root directory `./`, and production branch `main`.
3. Add the public environment values from `.env.example`. Set the final store name, currency, verified support email and any real HTTPS social-profile URLs only after the owner confirms them. Add a real `NEXT_PUBLIC_SITE_URL` for the deployed site.
4. Deploy and check the home, category, search, product, account, bag, shipping, privacy and mobile-navigation routes. Confirm catalog errors fail closed and that checkout remains closed.
5. Keep `NEXT_PUBLIC_INDEXING_ENABLED=false` until the real catalog and policies are reviewed. To opt into indexing later, set it to `true` only with the real HTTPS site URL. The code rejects placeholder `.example`/`.invalid` domains. Add Google verification only if the owner completes Search Console verification.

This workspace has not linked a Vercel project or deployed a public website. Connecting services and deployment remains an owner-controlled account action.

## Brand and optional public links

- Replace the temporary label through `NEXT_PUBLIC_STORE_NAME`.
- The reusable `StoreLogo` component selects dark or light styling; `/public/logo-icon.svg` and `/public/favicon.svg` provide the icon mark. The matching horizontal SVG assets are in `public/`.
- Set `NEXT_PUBLIC_STORE_CURRENCY` to the store’s ISO currency code. Product prices use each listing’s stored currency code.
- Set `NEXT_PUBLIC_SUPPORT_EMAIL` only to an inbox the owner controls. The Contact and Privacy pages do not collect form submissions.
- `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL` and `NEXT_PUBLIC_FACEBOOK_URL` accept only HTTPS URLs; no social link appears until a real profile is provided.
- Newsletter sign-up and customer reviews are intentionally omitted until their services, data policies and moderation process exist.

## Android-friendly editing

The repository is the permanent source of truth. Use the GitHub Android app or mobile website to browse/edit TypeScript, CSS, SVG, SQL and Markdown files. The normal text changes need no desktop software. Add binary product photography with Supabase Storage; do not commit service credentials or private customer data.

See [`docs/launch-checklist.md`](docs/launch-checklist.md) and `tests/` for the remaining owner checks. No license has been selected on the owner’s behalf.
