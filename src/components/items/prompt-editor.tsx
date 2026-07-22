"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/editor/code-editor";

type PromptEditorProps = {
  content: string;
  onSave: (content: string) => Promise<void>;
};

export function PromptEditor({ content, onSave }: PromptEditorProps) {
  const [local, setLocal] = useState(content);

  useEffect(() => {
    setLocal(content);
  }, [content]);

  return (
    <CodeEditor
      value={local}
      onChange={setLocal}
      onSave={onSave}
      placeholder="Write your AI prompt template. Use {{variable}} for placeholders."
      rows={14}
      label="Prompt template"
    />
  );
}
