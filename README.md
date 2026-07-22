# Knowledge Vault

Personal knowledge vault built with Next.js, Ant Design, Prisma, Better Auth, and Supabase.

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in Supabase PostgreSQL URLs, Better Auth secret, and optional Google OAuth credentials.

3. Install dependencies and run migrations:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm test` — Vitest unit tests
- `npm run test:e2e` — Playwright E2E tests
- `npm run db:migrate` — deploy Prisma migrations
- `npm run db:studio` — Prisma Studio

## Deployment (Vercel)

1. Push to GitHub and import into Vercel
2. Set all variables from `.env.example`
3. Run `npx prisma migrate deploy` against production database
4. Deploy and verify auth, CRUD, uploads, and search

## Architecture

- **UI:** Ant Design 6 + Tailwind utilities
- **Auth:** Better Auth (email/password + Google)
- **Database:** Supabase PostgreSQL via Prisma 7
- **Storage:** Supabase Storage (private `attachments` bucket)
- **Editor:** Quill with autosave and revisions

All sensitive operations go through server actions with workspace authorization checks.
# knowledge-vault
