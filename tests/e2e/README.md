# Phone-browser smoke checks

Run these checks only against a separate Supabase test project containing owner-created test catalog records. Do not use customer data or create sample production inventory.

1. At phone and desktop widths, check the NEXTVO home, Explore, all 14 departments, product search, department drawer and four primary destinations. Confirm no horizontal overflow and that desktop/mobile navigation remains keyboard- and touch-accessible.
2. With Supabase unconfigured, verify the customer sees the unconnected-catalog state, categories remain browseable, and no sample products, prices, reviews, stock or sales figures appear. When the database has no products, cards should clearly report that listings are not yet published.
3. In the configured test project, browse active products and confirm each image, price, currency, variant and stock status matches its current database record. Verify typeahead, search, category/subcategory filters, supported attributes, availability, real sale labels and paid-sales popularity sorting.
4. While signed out, add available products to the cart and wishlist, change quantities, remove items and reload. Confirm guest saves persist on the device. Sign in and verify saved items merge once; use a second signed-in account/browser to confirm no private cart or wishlist crosses accounts.
5. Test registration with a six-digit email OTP followed by password creation, ordinary email/password sign-in, Remember me both on and off, password reset, explicit logout, profile updates and saved-address defaults.
6. Confirm private account order history/details are constrained to the signed-in owner. `/track` must not expose an unauthenticated order lookup.
7. Open checkout as a guest and signed-in user. It must say checkout is paused, collect no delivery details, create no order and take no payment. The order API must reject attempts to create an order; no fake confirmation is shown.
8. Check accessible labels, visible keyboard focus, Escape and focus restoration for the department drawer, image gallery controls, reduced-motion settings, screen-reader announcements and safe-area behavior on a phone.
9. Verify search, cart, checkout, account, orders and tracking routes are excluded from indexing. Public indexing remains disabled until the owner configures a real HTTPS domain and explicitly opts in.

Payment, delivery rates, email delivery and live supplier fulfilment require separately configured services; storefront smoke checks do not prove those services work.
