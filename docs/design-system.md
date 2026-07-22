# Design System

Semantic tokens are defined in `src/app/globals.css` under `:root` and `[data-theme="dark"]`.

## Core tokens

- `--background`, `--foreground`, `--card`, `--sidebar`
- `--border`, `--border-strong`, `--muted`, `--text-secondary`
- `--accent`, `--accent-soft`, `--destructive`, `--focus-ring`
- `--code-bg`, `--selection`

## Shared components

- `EmptyState` — consistent empty UX with title, description, actions
- `ListSkeleton` / `PageSkeleton` — loading placeholders
- `PageHeader` — semantic page titles via `PageShell`

## Interaction

- Focus: `:focus-visible` with `--focus-ring`
- Reduced motion: `prefers-reduced-motion` disables transitions
- Save feedback: Zustand `saveStatus` in header

## Typography

- Interface: Space Grotesk (`--font-sans`)
- Code/brand: JetBrains Mono (`--font-mono`)
