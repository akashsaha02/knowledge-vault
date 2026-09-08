# Nook refactor roadmap

Incremental cleanup of the existing Next.js App Router modular monolith. Product stays a **personal knowledge vault**, not a team SaaS.

## Phase 0 — Baseline (2026-09-08)

Inspected current repo before changing product behavior.

### Scripts (`package.json`)

- `typecheck` → `tsc --noEmit`
- `lint` → `eslint .`
- `test` → `vitest run`
- `test:e2e` → `playwright test`
- `build` → `prisma generate && next build`

### Baseline results (before this refactor)

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm test` | **Fail** — all 4 Vitest files: `Cannot read properties of undefined (reading 'config')` at `describe()`. Windows drive-letter / Vitest dual-runtime collector bug. No tests executed. |
| `npm run test:e2e` | Not run in Phase 0 (needs live app + `DATABASE_URL`). Existing specs cover auth redirect, note create, project drill-down, password-reset copy. |
| `npm run build` | Not run in Phase 0 (expensive; deferred until after P0 fixes so the baseline is documented without blocking). |

### Pre-existing product issues verified against current code

1. **FTS visibility** — `searchItemsFullText` has no PRIVATE/creator filter; `findItems` filters PRIVATE to creator only; `getAccessibleItem` also allows OWNER/ADMIN (`editAll`). Three drifted implementations.
2. **Search highlight XSS** — `highlightMatch` inserts `<mark>` into `dangerouslySetInnerHTML` without escaping source text.
3. **Home recents** — `listItemsAction({ workspaceId, limit: 8 })` omits `status`, so DRAFT and ARCHIVED (non-deleted) can appear.
4. **Empty share links** — Settings calls `createShareLinkAction(workspaceId, {})` with no `itemId`; service allows it; public page then shows “no item attached”.
5. **Import validation** — `JSON.parse` + unbounded loop; no Zod schema; malformed `type`/`status` accepted.
6. **Vitest collector** — broken on this Windows workspace path.

### Already correct (do not re-fix)

- Workspace membership / `canEditItem` / `hasPermission`
- Permanent delete only from TRASHED + `deletedAt`
- Revision coalescing window in `updateItemForUser`
- Bookmark SSRF checks in `validateBookmarkUrl`
- Attachment storage-key validation tests
- Share password hashing (`scrypt:`)
- URL contracts `?item=`, `?new=1`, `?tab=commands`
- Legacy redirects `/dashboard/inbox`, `/dashboard/commands`
- Export `version: 1`
- Note color persistence
- Keyboard shortcuts Ctrl/Cmd+K, Ctrl/Cmd+N, Ctrl/Cmd+Shift+N

### Working tree note

`main` already had uncommitted UI/feature edits. This refactor builds on that work rather than reverting it.

---

## Phase 1 — Critical business logic / security

- Centralize item visibility (`item-access.ts`); apply to `findItems`, FTS, and `getAccessibleItem`.
- Escape search highlight source text.
- Home + default item lists: ACTIVE (non-deleted) only unless a view opts into another status.
- Require `itemId` for share-link creation; remove Settings item-less create; add item-level Share dialog.
- Zod import schema compatible with export `version: 1`.

## Phase 2 — Tests around business rules

- Fix Vitest `root` so the collector loads a single runtime.
- Add unit tests: ACL/visibility, lifecycle helpers, import schema, share-link usability, highlight escaping, item-type registry.

## Phase 3 — Feature ownership

- Item type registry as create-surface source of truth.
- Search calls Items public service, not repository internals.
- Project/collection slug uniqueness moved into their repositories.
- Workspace active-id lookup moved into workspace repository.

## Phase 4 — Split ItemWorkspace

- Extract create defaults, URL/tab/`new=1` handling, mutations, delete dialogs, organize panel.
- Keep ItemWorkspace as layout composition.

## Phase 5–6 — Persistence + registry

- Document remaining direct Prisma in tiny services.
- Registry drives create menu, mobile sheet, command palette, workspace create.

## Phase 7–19 — Design system + product UI

- Tokens (8px rhythm, existing radii).
- Demote workspace switcher when a user has one workspace.
- Collections remain secondary; Projects primary.
- Item-centric sharing; Settings sections; typed share page; compact Details panel.

## Phase 20–21 — Dead code + boundaries

- Remove unused landing-blob CSS.
- Dual-read legacy `kv-*` localStorage keys (do not wipe onboarding).
- Document import direction; ESLint restriction for `server-only` modules from client folders where practical.

## Phase 22 — Regression

Ran after implementation:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm test` | Pass — 7 files, 46 tests (Vitest Windows runner canonicalizes drive letter) |
| `npm run test:e2e` | Pass — 8 Playwright tests including `?new=1` note create and project drill-down |
| `npm run build` | Pass (Next.js 16.2.11; middleware→proxy deprecation warning is pre-existing) |


---

## Schema debt (no destructive migration)

See implementation report section 10. Favorites source of truth is `Item.isFavorite`; `Favorite` table is unused by product code (only `scripts/clear-app-data.ts`). Keep until a planned migration exists.
