# Testing Strategy

## Unit tests (Vitest)

- Run: `npm test`
- Location: `src/**/__tests__/*.test.ts`
- Covers: utilities, permissions, security helpers, search utils

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
