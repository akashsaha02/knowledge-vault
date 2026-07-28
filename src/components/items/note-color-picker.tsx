"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { NOTE_COLORS, type NoteColorId } from "@/lib/note-colors";

type NoteColorPickerProps = {
  value?: string | null;
  onChange: (colorId: NoteColorId) => void;
  className?: string;
};

export function NoteColorPicker({ value, onChange, className }: NoteColorPickerProps) {
  return (
    <div className={cn("note-color-picker", className)} role="group" aria-label="Note color">
      {NOTE_COLORS.map((color) => {
        const selected = (value ?? "cream") === color.id;
        return (
          <button
            key={color.id}
            type="button"
            title={color.label}
            aria-label={color.label}
            aria-pressed={selected}
            className={cn("note-color-swatch", selected && "note-color-swatch--selected")}
            style={
              {
                "--swatch-accent": color.border,
                background: color.border,
              } as CSSProperties
            }
            onClick={() => onChange(color.id)}
          />
        );
      })}
    </div>
  );
}
