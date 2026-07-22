"use client";

import { PlusOutlined } from "@ant-design/icons";
import { App, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createItemAction } from "@/features/items/item.actions";
import { htmlToContent, plainTextToHtml } from "@/components/editor/note-content";

type QuickCaptureProps = {
  workspaceId: string;
};

export function QuickCapture({ workspaceId }: QuickCaptureProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

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
      });
      setValue("");
      setExpanded(false);
      message.success("Note created");
      router.push(`/dashboard/notes?item=${item.id}`);
    } catch {
      message.error("Could not create note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`quick-capture ${expanded ? "quick-capture-expanded" : ""}`}>
      <Input.TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setExpanded(true)}
        placeholder="Take a note..."
        autoSize={expanded ? { minRows: 3, maxRows: 8 } : { minRows: 1, maxRows: 1 }}
        className="quick-capture-input"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSave();
          }
        }}
      />
      {expanded ? (
        <div className="quick-capture-actions">
          <span className="quick-capture-hint">Ctrl+Enter to save</span>
          <button
            type="button"
            className="quick-capture-close"
            onClick={() => {
              setExpanded(false);
              setValue("");
            }}
          >
            Close
          </button>
          <button
            type="button"
            className="quick-capture-save"
            disabled={!value.trim() || saving}
            onClick={() => void handleSave()}
          >
            <PlusOutlined /> Save note
          </button>
        </div>
      ) : null}
    </div>
  );
}
