# Testing Strategy

## Unit tests (Vitest)

- Run: `npm test`
- Location: `src/**/__tests__/*.test.ts`
- Covers: utilities, permissions, visibility, lifecycle, import schema, share-link state, search highlight escaping, item-type registry
- On Windows Git Bash, `scripts/run-vitest.mjs` canonicalizes the drive letter so Vitest does not load two runtimes (`Cannot read properties of undefined (reading 'config')`).

## E2E tests (Playwright)

- Run: `npm run test:e2e`
- Location: `e2e/*.spec.ts`
- Smoke tests for landing, auth, and navigation

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs typecheck, lint, and unit tests on push/PR.

## Recommended additions

- Integration tests for server actions with test database
- Accessibility tests with axe in Playwright
- Visual regression for dashboard shell (optional)
