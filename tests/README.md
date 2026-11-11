# Storefront checks

The repository includes formatting, strict TypeScript, dependency-audit and production-build commands, but no automated browser or database test runner. The notes in `components/`, `e2e/` and `database/` are manual smoke-check guidance, not automated tests. GitHub Actions is not configured for this repository yet.

Before customer access, use a separate Supabase test project to verify the live-only catalog, all active departments/subcategories, search, phone navigation, account isolation and saved-item revalidation. Checkout/order submission is intentionally disabled, so a successful purchase cannot be tested until a future payment-integrated implementation is reviewed.
