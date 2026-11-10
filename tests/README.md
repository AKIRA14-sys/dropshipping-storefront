# Verification notes

The project provides strict TypeScript, formatting and production-build checks, all of which pass locally. The planned GitHub Actions workflow is not yet on the repository because the current GitHub integration lacks the `workflows` permission. There is not yet an automated browser/E2E or database test runner, so do not describe the manual checks below as automated tests.

- `components/`: add focused component tests when a test runner is selected.
- `e2e/`: phone-browser smoke checklist: open the home page; browse each of the four departments; search by product title; filter/sort; open a product; add/remove and change quantity in the bag; submit demo delivery details; verify the code is shown and tracking requires the matching email.
- `database/`: in a non-production Supabase project, run migrations 001–004 in order and `seed.sql`; confirm only active products/categories are publicly readable, anon cannot select orders/order_items, create a test order, and track it with the correct code+email but not an incorrect email.

Never test with real customer data or use the production database for smoke tests.
