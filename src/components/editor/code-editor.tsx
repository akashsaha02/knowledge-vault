"use client";

import { Input } from "antd";
import { useEffect, useRef } from "react";
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
  valueRef.current = value;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const { schedule, flush } = useAutosave(async () => {
    await onSaveRef.current(valueRef.current);
  });

  return (
    <div className="code-editor">
      {label ? <label className="code-editor-label">{label}</label> : null}
      <Input.TextArea
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
