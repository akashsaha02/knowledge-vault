# Nook

Personal knowledge vault — notes, links, code, and files in one place.

**Tagline:** Your colorful corner for ideas

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

## Architecture

- **UI:** Next.js App Router, Tailwind CSS v4, Radix UI primitives
- **Auth:** Better Auth (email/password + Google)
- **Database:** Supabase PostgreSQL via Prisma 7
- **Storage:** Supabase Storage (private `attachments` bucket)
- **Editors:** Quill (notes), CodeMirror (code), autosave with revisions

All sensitive operations go through server actions with workspace authorization checks.
