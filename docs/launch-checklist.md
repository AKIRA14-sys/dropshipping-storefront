# NEXTVO store launch checklist

Before opening the storefront to shoppers:

- [x] Confirm the store name: **NEXTVO**. Choose the supported currencies and shipping countries before launch.
- [ ] Create a Supabase project; apply migrations `001`–`007` in order, then run `supabase/seed.sql` for the 14 departments and their subcategories. The seed includes no products or fabricated sales data.
- [ ] Configure email OTP, password recovery URLs and test Remember me/session-only behavior.
- [ ] Publish accurate products with verified price/currency, stock, options, specifications, supplier details, permitted product images and descriptions.
- [ ] Test the live catalog, header typeahead, department search, category/subcategory filters, product variants, gallery, cart and device/account wishlist behavior.
- [ ] Test account ownership with two separate test accounts. Verify profiles, addresses, carts, wishlists and private order history remain isolated.
- [ ] Configure the actual support inbox, delivery coverage/charges/estimates, returns/refunds, privacy/retention/deletion notice, terms and required consumer disclosures.
- [ ] Confirm promotions, sale prices, featured/new-arrival labels and bestseller counts use genuine store data.
- [ ] Select and implement a payment provider and secure server-side order flow in a separately reviewed change. Verify provider payment status before changing an order to paid. Checkout is closed until then.
- [ ] Configure email notifications and fulfilment/order updates only after a verified order workflow exists.
- [ ] Connect the GitHub repository to Vercel, add public Supabase values and the actual HTTPS site URL, and confirm a production deployment.
- [ ] Check phone layouts, keyboard navigation, drawer focus/Escape behavior, accessibility labels, image alt text, metadata, `robots.txt`, `sitemap.xml`, password recovery and no-catalog/error states.
- [ ] Enable search indexing only after the owner approves it and the real listings and customer policies are ready. Review applicable privacy, consumer, product-safety, tax and warranty requirements for each market.
