"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { NoteColorPicker } from "@/components/items/note-color-picker";
import { createItemAction } from "@/features/items/item.actions";
import { htmlToContent, plainTextToHtml } from "@/components/editor/note-content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { withNoteColor } from "@/lib/item-metadata";
import {
  readLastNoteColor,
  saveLastNoteColor,
  type NoteColorId,
} from "@/lib/note-colors";

type QuickCaptureProps = {
  workspaceId: string;
};

export function QuickCapture({ workspaceId }: QuickCaptureProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [noteColor, setNoteColor] = useState<NoteColorId>(() => readLastNoteColor());

  function handleColorChange(colorId: NoteColorId) {
    setNoteColor(colorId);
    saveLastNoteColor(colorId);
  }

  function handleClose() {
    setExpanded(false);
    setValue("");
  }

  async function handleSave() {
    const text = value.trim();
    if (!text) return;

    setSaving(true);
    try {
      const firstLine = text.split("\n")[0].slice(0, 120);
      const item = await createItemAction({
        workspaceId,
        type: "NOTE",
        title: firstLine || "Untitled note",
        plainText: text,
        content: htmlToContent(plainTextToHtml(text)),
        status: "ACTIVE",
        metadata: withNoteColor({}, noteColor),
      });
      handleClose();
      toast.success("Note saved");
      router.push(`/dashboard/notes?item=${item.id}`);
    } catch {
      toast.error("Could not create note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`quick-capture${expanded ? " quick-capture-expanded" : ""}`}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setExpanded(true)}
        placeholder="What do you want to remember?"
        rows={expanded ? 4 : 1}
        className="quick-capture-input"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSave();
          }
          if (e.key === "Escape") {
            handleClose();
          }
        }}
      />

      {expanded ? (
        <div className="quick-capture-footer">
          <div className="quick-capture-color-row">
            <span className="quick-capture-color-label">Color</span>
            <NoteColorPicker value={noteColor} onChange={handleColorChange} />
          </div>

          <div className="quick-capture-actions">
            <span className="quick-capture-hint">Ctrl+Enter to save</span>
            <div className="quick-capture-buttons">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!value.trim() || saving}
                onClick={() => void handleSave()}
              >
                Save note
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
