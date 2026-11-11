# Storefront checks

The repository has formatting, TypeScript, dependency-audit and production-build commands, but no automated browser or database test runner. The manual notes in `components/`, `e2e/` and `database/` are smoke-check guidance, not automated tests. GitHub Actions is not configured on this repository yet.

Before customer access, use a separate Supabase test project and verify the live catalog, account isolation, saved-item revalidation, default-address updates, noindex behavior and phone layout. Checkout/order submission is intentionally disabled, so a successful purchase cannot be tested until a future payment-integrated implementation is reviewed.
