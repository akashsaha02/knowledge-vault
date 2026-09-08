# Design System

Semantic tokens are defined in `src/app/globals.css` under `:root`.

Nook is a private workspace for notes, code, and saved knowledge — dark-first, warm, content-first. Brand wine is `#660033`.

## Typography

- Interface: DM Sans (`--font-sans`)
- Code / commands / technical content: JetBrains Mono (`--font-mono`)

## Core tokens

- Surfaces: `--background`, `--foreground`, `--card`, `--sidebar`, `--surface-elevated`
- Borders: `--border`, `--border-strong`
- Text: `--muted`, `--text-secondary`
- Brand: `--brand`, `--brand-soft`, `--ring`
- Radii: `--radius-sm` 6px, `--radius-md` 8px, `--radius-lg` 12px
- Spacing rhythm: `--space-1` 4px through `--space-6` 24px (8px base)
- Workspace: `--workspace-pad` 16px, `--workspace-gap` 12px
- Controls: `--control-height` 36px, `--icon-sm` 16px

## Shared components

- `EmptyState` — niche copy, not generic “No data”
- List / page skeletons
- `PageHeader` via `PageShell`
- Type-specific previews (note color, snippet, command, bookmark) rather than one generic card

## Interaction

- Focus: `:focus-visible` with `--focus-ring` / `--ring`
- Reduced motion: `prefers-reduced-motion`
- Save feedback: Zustand `saveStatus` in header
