import type { CSSProperties } from "react";

export const NOTE_COLORS = [
  { id: "honey", label: "Honey", bg: "#2a1f0a", border: "#f59e0b", text: "#fcd34d" },
  { id: "sky", label: "Sky", bg: "#0f1a2e", border: "#3b82f6", text: "#93c5fd" },
  { id: "mint", label: "Mint", bg: "#0a1f18", border: "#10b981", text: "#6ee7b7" },
  { id: "lilac", label: "Lilac", bg: "#1a1030", border: "#8b5cf6", text: "#c4b5fd" },
  { id: "coral", label: "Wine", bg: "#1a0a14", border: "#660033", text: "#d4729a" },
  { id: "blush", label: "Blush", bg: "#2a1020", border: "#ec4899", text: "#f9a8d4" },
  { id: "slate", label: "Slate", bg: "#1a1f28", border: "#64748b", text: "#cbd5e1" },
  { id: "cream", label: "Cream", bg: "#1e1a16", border: "#a8a29e", text: "#e7e5e4" },
] as const;

export type NoteColorId = (typeof NOTE_COLORS)[number]["id"];

export const DEFAULT_NOTE_COLOR: NoteColorId = "cream";

const LAST_NOTE_COLOR_KEY = "nook-last-note-color";

export function readLastNoteColor(): NoteColorId {
  if (typeof window === "undefined") return DEFAULT_NOTE_COLOR;
  try {
    const stored = localStorage.getItem(LAST_NOTE_COLOR_KEY);
    if (stored && NOTE_COLORS.some((c) => c.id === stored)) {
      return stored as NoteColorId;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_NOTE_COLOR;
}

export function saveLastNoteColor(id: NoteColorId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_NOTE_COLOR_KEY, id);
  } catch {
    /* ignore */
  }
}

export function getNoteColorById(id?: string | null) {
  return NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS.find((c) => c.id === DEFAULT_NOTE_COLOR)!;
}

export function getNoteColorStyle(id?: string | null): CSSProperties {
  const color = getNoteColorById(id);
  return {
    ["--note-color-bg" as string]: color.bg,
    ["--note-color-border" as string]: color.border,
    ["--note-color-text" as string]: color.text,
    background: color.bg,
    borderColor: color.border,
    color: color.text,
  };
}

export function getNoteColorSidebarStyle(id?: string | null): CSSProperties {
  const color = getNoteColorById(id);
  return {
    borderLeftColor: color.border,
    background: `color-mix(in srgb, ${color.bg} 70%, var(--card))`,
  };
}
