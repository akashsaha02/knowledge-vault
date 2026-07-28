export type ItemMetadata = {
  isChecked?: boolean;
  noteColor?: string;
  language?: string;
  code?: string;
  shell?: string;
  command?: string;
  url?: string;
  template?: string;
  [key: string]: unknown;
};

export function getItemChecked(metadata: unknown): boolean {
  return Boolean((metadata as ItemMetadata | null)?.isChecked);
}

export function withItemChecked(metadata: unknown, isChecked: boolean): ItemMetadata {
  return {
    ...((metadata as ItemMetadata | null) ?? {}),
    isChecked,
  };
}

export function getNoteColor(metadata: unknown): string | undefined {
  const color = (metadata as ItemMetadata | null)?.noteColor;
  return typeof color === "string" ? color : undefined;
}

export function withNoteColor(metadata: unknown, noteColor: string): ItemMetadata {
  return {
    ...((metadata as ItemMetadata | null) ?? {}),
    noteColor,
  };
}
