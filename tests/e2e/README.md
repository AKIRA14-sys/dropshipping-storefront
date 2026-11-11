# Phone-browser smoke checks

Run these checks only against a separate Supabase test project containing owner-created test catalog records. Do not use customer data or create sample production inventory.

1. At a phone viewport, check that the homepage, four approved departments, product search and category navigation have no horizontal overflow. With Supabase unconfigured, verify that the customer sees a clear setup/empty state rather than products.
2. In the configured test project, browse active products and confirm each image, price, currency, variant and stock status matches its current database record. Verify that search, supported attribute filters, availability, real sale labels and popularity sorting only use the corresponding live data.
3. While signed out, add available products to the bag, change quantities, remove an item and reload. Confirm the guest bag persists in that browser and does not require an account.
4. Add items to a guest wishlist, sign in, and verify it merges without duplicate products. Add items to the bag before signing in, then verify the guest and account bags merge once; revisit on a second signed-in browser to verify account persistence.
5. Test registration with a six-digit email OTP followed by password creation, ordinary email/password sign-in, Remember me both on and off, password reset, and explicit logout. Confirm each account's profile, addresses, bag, wishlist and orders remain private to that account.
6. Confirm account order history and order details use only signed-in records. Test `/track` as signed out and signed in; it must not expose an unauthenticated order lookup.
7. Confirm checkout requires sign-in and clearly states that ordering and payment are not enabled. The checkout API must reject attempts to create an order and must never display a fake order confirmation.
8. Check keyboard focus, Escape behavior for the mobile menu and image lightbox, visible focus styles, screen-reader labels, and reduced-motion settings.
9. Verify that search, cart, checkout, account, order and tracking routes are excluded from indexing; public indexing remains disabled until an owner configures a real HTTPS domain and opts in.

Payment, delivery rates, email delivery and live supplier fulfilment require separately configured services and must not be treated as passed by these storefront checks.
