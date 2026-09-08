# Architecture Overview

Nook is a Next.js 16 App Router personal knowledge vault backed by PostgreSQL (Prisma 7), Better Auth, and Supabase Storage.

## Layers

- **Routes** (`src/app/`) — composition: params, session/workspace, render feature UI
- **Features** (`src/features/`) — `actions.ts` → `service.ts` → `repository.ts`
- **Components** (`src/components/`) — UI that has not yet moved into a feature folder
- **Lib / infra** (`src/lib/`) — generic helpers, auth, db, email, storage

## Data flow

Browser → App Router → Client / Server Components → Server Actions → Services → Repositories → Prisma → PostgreSQL

Server Components may call services for reads. Mutations go through Server Actions.

## Import direction

```
app → features → shared/lib + infra
```

- App files should not contain business rules.
- Client components may call Server Actions only — never repositories, Prisma, or server services.
- Feature A must not import Feature B's repository internals.
- Search depends on Items via `searchAccessibleItems` (public service), not FTS SQL details.

## Key conventions

- Validate untrusted input with Zod in server actions
- Scope queries by `workspaceId`
- PRIVATE visibility is centralized in `src/features/items/item-access.ts`
- Item type defaults live in `src/features/items/item-type-registry.ts`
- Use targeted `revalidatePath` per content type after mutations
