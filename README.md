# Nook

Personal knowledge vault — notes, links, code, and files in one place.

**Tagline:** Your space for things worth keeping

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in Supabase PostgreSQL URLs, Better Auth secret, and optional Google OAuth credentials.

   For password reset emails in production, set `RESEND_API_KEY` and `EMAIL_FROM`.
   In development, reset emails are logged to the server console.

3. Install dependencies and run migrations:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

## Scripts

- `npm run dev` — development server (port 8000)
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm test` — Vitest unit tests
- `npm run test:e2e:install` — install Playwright Chromium browser
- `npm run test:e2e` — Playwright E2E tests (requires `DATABASE_URL` for authenticated flows)
- `npm run db:migrate` — deploy Prisma migrations
- `npm run db:studio` — Prisma Studio

## Deployment (Vercel)

1. Push to GitHub and import into Vercel
2. Set all variables from `.env.example`
3. Run `npx prisma migrate deploy` against production database
4. Deploy and verify auth, CRUD, uploads, and search

### GitHub Actions

Pushes and pull requests run `.github/workflows/ci.yml`:

- typecheck, lint, unit tests, and production build
- Playwright against a Postgres + pgvector service (including authenticated flows)
- production deploy to Vercel on `main` / `master` after those jobs pass

For the deploy job, add these repository secrets:

- `VERCEL_TOKEN` — Vercel account token
- `VERCEL_ORG_ID` — from `.vercel/project.json` after `npx vercel link`
- `VERCEL_PROJECT_ID` — from the same file

If Vercel already deploys from GitHub, skip those secrets and remove the `deploy` job to avoid a second production deploy.

## Architecture

- **UI:** Next.js App Router, Tailwind CSS v4, Radix UI primitives
- **Auth:** Better Auth (email/password + Google)
- **Database:** Supabase PostgreSQL via Prisma 7
- **Storage:** Supabase Storage (private `attachments` bucket)
- **Editors:** Quill (notes), CodeMirror (code), autosave with revisions

All sensitive operations go through server actions with workspace authorization checks.
