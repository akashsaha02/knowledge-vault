"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { useUiStore } from "@/stores/ui-store";
import {
  contentToHtml,
  htmlToContent,
  htmlToPlainText,
} from "@/components/editor/note-content";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="editor-loading">
      <Spin />
    </div>
  ),
});

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

type NoteEditorProps = {
  content?: unknown;
  plainText?: string | null;
  onChange?: (json: unknown, plainText: string) => void;
  onSave?: (json: unknown, plainText: string) => Promise<void>;
  placeholder?: string;
};

export function NoteEditor({
  content,
  plainText,
  onChange,
  onSave,
  placeholder = "Start writing...",
}: NoteEditorProps) {
  const setSaveStatus = useUiStore((s) => s.setSaveStatus);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [html, setHtml] = useState(() => contentToHtml(content, plainText));
  const itemKey = JSON.stringify(content ?? plainText ?? "");

  useEffect(() => {
    setHtml(contentToHtml(content, plainText));
  }, [itemKey, content, plainText]);

  const persist = useCallback(
    (nextHtml: string, immediate = false) => {
      const json = htmlToContent(nextHtml);
      const nextPlainText = htmlToPlainText(nextHtml);
      onChange?.(json, nextPlainText);

      if (!onSave) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const runSave = async () => {
        setSaveStatus("saving");
        try {
          await onSave(json, nextPlainText);
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      };

      if (immediate) {
        void runSave();
        return;
      }

      setSaveStatus("editing");
      debounceRef.current = setTimeout(() => {
        void runSave();
      }, 800);
    },
    [onChange, onSave, setSaveStatus],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void persist(html, true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [html, persist]);

  return (
    <div className="editor-shell note-editor">
      <ReactQuill
        theme="snow"
        value={html}
        onChange={(value) => {
          setHtml(value);
          persist(value);
        }}
        placeholder={placeholder}
        modules={{ toolbar: TOOLBAR }}
        className="note-editor-quill"
      />
    </div>
  );
}
