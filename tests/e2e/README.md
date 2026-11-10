# Phone-browser smoke checks (manual)

1. Open `/` on a phone-sized viewport and verify the hero, four categories, and demo notice.
2. Open each `/categories/<slug>` page; verify department filtering works.
3. Search from the header or `/search`, try an unmatched term, then clear filters and sort by price.
4. Open a product, add it to the bag, change quantity, remove it, and confirm the bag count updates.
5. Place a demo checkout using fictional test details, confirm the tracking reference, and find the order using the same checkout email in the same browser.
6. Confirm a wrong email does not reveal order details, and that the UI says no payment was taken.
7. Inspect `robots.txt` and `sitemap.xml`: crawling should be disabled until `NEXT_PUBLIC_INDEXING_ENABLED=true`.

Do not use real customer data or treat demo orders as fulfilment requests.
