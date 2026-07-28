"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { EditorSkeleton } from "@/components/ui/loading-skeleton";
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
      <EditorSkeleton />
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
  itemId: string;
  content?: unknown;
  plainText?: string | null;
  onChange?: (json: unknown, plainText: string) => void;
  onSave?: (json: unknown, plainText: string) => Promise<void>;
  placeholder?: string;
  className?: string;
};

export function NoteEditor({
  itemId,
  content,
  plainText,
  onChange,
  onSave,
  placeholder = "Start writing...",
  className,
}: NoteEditorProps) {
  const [html, setHtml] = useState(() => contentToHtml(content, plainText));
  const loadedItemIdRef = useRef(itemId);
  const htmlRef = useRef(html);
  htmlRef.current = html;

  useEffect(() => {
    if (itemId !== loadedItemIdRef.current) {
      loadedItemIdRef.current = itemId;
      setHtml(contentToHtml(content, plainText));
    }
  }, [itemId, content, plainText]);

  const saveContent = useCallback(async () => {
    if (!onSave) return;
    const json = htmlToContent(htmlRef.current);
    const nextPlainText = htmlToPlainText(htmlRef.current);
    await onSave(json, nextPlainText);
  }, [onSave]);

  const { schedule, flush } = useAutosave(saveContent, { enabled: Boolean(onSave) });

  const handleChange = useCallback(
    (value: string) => {
      setHtml(value);
      const json = htmlToContent(value);
      const nextPlainText = htmlToPlainText(value);
      onChange?.(json, nextPlainText);
      if (onSave) schedule();
    },
    [onChange, onSave, schedule],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void flush();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flush]);

  return (
    <div className={`editor-shell note-editor${className ? ` ${className}` : ""}`}>
      <ReactQuill
        key={itemId}
        theme="snow"
        value={html}
        onChange={handleChange}
        placeholder={placeholder}
        modules={{ toolbar: TOOLBAR }}
        className="note-editor-quill"
      />
    </div>
  );
}
