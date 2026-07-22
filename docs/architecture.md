# Architecture Overview

Knowledge Vault is a Next.js 16 App Router application backed by PostgreSQL (Prisma 7), Better Auth, and Supabase Storage.

## Layers

- **Routes** (`src/app/`) — thin page components and layouts
- **Components** (`src/components/`) — UI organized by domain (dashboard, items, editor, ui)
- **Features** (`src/features/`) — `actions.ts` → `service.ts` → `repository.ts`
- **Lib** (`src/lib/`) — shared utilities, nav config, storage helpers

## Data flow

Server Components fetch initial data. Client islands call Server Actions for mutations. Workspace authorization is enforced in the service layer via `requireWorkspaceMember` and `requireWorkspacePermission`.

## Key conventions

- Validate external input with Zod in server actions
- Scope all queries by `workspaceId`
- Use targeted `revalidatePath` per content type after mutations
- Prefer Server Components; use Client Components only for interactivity
