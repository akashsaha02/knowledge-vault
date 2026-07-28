"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAutosave } from "@/hooks/use-autosave";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  rows?: number;
  label?: string;
};

export function CodeEditor({
  value,
  onChange,
  onSave,
  placeholder = "Enter code...",
  rows = 16,
  label,
}: CodeEditorProps) {
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const { schedule, flush } = useAutosave(async () => {
    await onSaveRef.current(valueRef.current);
  });

  return (
    <div className="code-editor">
      {label ? <label className="code-editor-label">{label}</label> : null}
      <Textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          schedule();
        }}
        onBlur={() => void flush()}
        placeholder={placeholder}
        rows={rows}
        className="code-editor-textarea font-mono"
        spellCheck={false}
        aria-label={label ?? "Code editor"}
      />
    </div>
  );
}
