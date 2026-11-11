# Store launch checklist

Before opening the storefront to shoppers:

- [ ] Confirm the final store name, logo wordmark, currency and supported countries.
- [ ] Create a Supabase project; apply migrations `001`–`006` in order and run `supabase/seed.sql` for the four department taxonomies only.
- [ ] Configure email OTP, password recovery URLs and test Remember me/session-only behavior.
- [ ] Publish accurate products with verified prices/currency, stock, options, specifications, supplier details and images the store is permitted to use.
- [ ] Test public catalog access, search and filtering; test two separate accounts to verify profiles, addresses, bags, wishlists and order history remain private.
- [ ] Configure the actual support inbox, delivery coverage/charges/estimates, returns/refunds, privacy/retention/deletion notice, terms and required consumer disclosures.
- [ ] Confirm that promotions, sale prices, featured/new-arrival labels and bestseller counts are based on genuine store data.
- [ ] Select and implement a payment provider and secure server-side order flow in a separately reviewed change. Verify provider payment status before changing an order to paid. The current checkout is closed and must stay closed until then.
- [ ] Configure email notifications and fulfilment/order updates only after a real verified order workflow exists.
- [ ] Connect the public GitHub repository to Vercel, add only public Supabase values and the real site URL, then confirm a production deployment.
- [ ] Test phone layouts, keyboard access, image descriptions, metadata, `robots.txt`, `sitemap.xml`, password recovery, and all empty/error states.
- [ ] Enable search indexing only after owner approval, real listings and customer policies are ready. Review applicable privacy, consumer, product-safety, tax and warranty requirements for each market.
