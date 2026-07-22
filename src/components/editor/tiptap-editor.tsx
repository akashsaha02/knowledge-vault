"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import { Button, Space, Tooltip } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect, useRef } from "react";
import { useUiStore } from "@/stores/ui-store";

type TiptapEditorProps = {
  content?: unknown;
  onChange?: (json: unknown, plainText: string) => void;
  onSave?: (json: unknown, plainText: string) => Promise<void>;
  placeholder?: string;
};

export function TiptapEditor({
  content,
  onChange,
  onSave,
  placeholder = "Start writing...",
}: TiptapEditorProps) {
  const setSaveStatus = useUiStore((s) => s.setSaveStatus);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON();
      const plainText = ed.getText();
      onChange?.(json, plainText);
      setSaveStatus("editing");

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (!onSave) return;
        setSaveStatus("saving");
        try {
          await onSave(json, plainText);
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      }, 800);
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!editor || !onSave) return;
        const json = editor.getJSON();
        const plainText = editor.getText();
        setSaveStatus("saving");
        onSave(json, plainText)
          .then(() => setSaveStatus("saved"))
          .catch(() => setSaveStatus("error"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor, onSave, setSaveStatus]);

  if (!editor) return null;

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b border-neutral-200 bg-neutral-50">
        <Space size={4}>
          <Tooltip title="Bold">
            <Button
              type={editor.isActive("bold") ? "primary" : "text"}
              size="small"
              icon={<BoldOutlined />}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
          </Tooltip>
          <Tooltip title="Italic">
            <Button
              type={editor.isActive("italic") ? "primary" : "text"}
              size="small"
              icon={<ItalicOutlined />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
          </Tooltip>
          <Tooltip title="Strike">
            <Button
              type={editor.isActive("strike") ? "primary" : "text"}
              size="small"
              icon={<StrikethroughOutlined />}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </Tooltip>
          <Tooltip title="Bullet list">
            <Button
              type={editor.isActive("bulletList") ? "primary" : "text"}
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
          </Tooltip>
          <Tooltip title="Numbered list">
            <Button
              type={editor.isActive("orderedList") ? "primary" : "text"}
              size="small"
              icon={<OrderedListOutlined />}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </Tooltip>
        </Space>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
