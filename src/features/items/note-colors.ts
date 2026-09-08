import type { CSSProperties } from "react";

export const NOTE_COLORS = [
  { id: "cream", label: "Cream", bg: "#FFF4D8", border: "#E6D4A8", text: "#443B2C" },
  { id: "rose", label: "Rose", bg: "#FBE9EC", border: "#E8C5CC", text: "#493338" },
  { id: "lavender", label: "Lavender", bg: "#EEEAF8", border: "#CFC6E6", text: "#393447" },
  { id: "sage", label: "Sage", bg: "#E8F0E5", border: "#C5D6C0", text: "#344033" },
  { id: "sky", label: "Sky", bg: "#E8F1F6", border: "#C3D5E0", text: "#334047" },
  { id: "neutral", label: "Neutral", bg: "#F3F1EE", border: "#D8D4CE", text: "#383533" },
] as const;

export type NoteColorId = (typeof NOTE_COLORS)[number]["id"];

export const DEFAULT_NOTE_COLOR: NoteColorId = "cream";

const LEGACY_COLOR_MAP: Record<string, NoteColorId> = {
  honey: "cream",
  mint: "sage",
  lilac: "lavender",
  coral: "rose",
  blush: "rose",
  slate: "neutral",
};

const LAST_NOTE_COLOR_KEY = "nook-last-note-color";

export function resolveNoteColorId(id?: string | null): NoteColorId {
  if (id && NOTE_COLORS.some((color) => color.id === id)) {
    return id as NoteColorId;
  }
  if (id && LEGACY_COLOR_MAP[id]) return LEGACY_COLOR_MAP[id];
  return DEFAULT_NOTE_COLOR;
}

export function readLastNoteColor(): NoteColorId {
  if (typeof window === "undefined") return DEFAULT_NOTE_COLOR;
  try {
    const stored = localStorage.getItem(LAST_NOTE_COLOR_KEY);
    return resolveNoteColorId(stored);
  } catch {
    return DEFAULT_NOTE_COLOR;
  }
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
  const resolved = resolveNoteColorId(id);
  return NOTE_COLORS.find((color) => color.id === resolved)!;
}

export function getNoteColorStyle(id?: string | null): CSSProperties {
  const color = getNoteColorById(id);
  return {
    ["--note-color-bg" as string]: `var(--note-${color.id}-bg)`,
    ["--note-color-border" as string]: `var(--note-${color.id}-border)`,
    ["--note-color-text" as string]: `var(--note-${color.id}-text)`,
  };
}

export function getNoteColorSidebarStyle(id?: string | null): CSSProperties {
  const color = getNoteColorById(id);
  return {
    borderLeftColor: `var(--note-${color.id}-border)`,
    background: `color-mix(in srgb, var(--note-${color.id}-bg) 70%, var(--surface))`,
  };
}
