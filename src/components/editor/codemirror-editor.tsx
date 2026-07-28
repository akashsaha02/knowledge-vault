"use client";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo, useRef } from "react";

const LANGUAGE_EXTENSIONS: Record<string, () => ReturnType<typeof javascript>> = {
  typescript: () => javascript({ typescript: true }),
  javascript: () => javascript(),
  python: () => python(),
  bash: () => javascript(),
  json: () => json(),
  sql: () => sql(),
  html: () => html(),
  css: () => css(),
  go: () => javascript(),
  rust: () => rust(),
};

type CodeMirrorEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  language?: string;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  "aria-label"?: string;
};

export function CodeMirrorEditor({
  value,
  onChange,
  onBlur,
  language = "typescript",
  placeholder,
  minHeight = "320px",
  className = "",
  "aria-label": ariaLabel,
}: CodeMirrorEditorProps) {
  const valueRef = useRef(value);
  valueRef.current = value;

  const extensions = useMemo(() => {
    const factory = LANGUAGE_EXTENSIONS[language] ?? LANGUAGE_EXTENSIONS.typescript;
    return [factory()];
  }, [language]);

  return (
    <div className={`codemirror-shell ${className}`.trim()}>
      <CodeMirror
        value={value}
        height={minHeight}
        theme={vscodeDark}
        extensions={extensions}
        onChange={onChange}
        onBlur={() => onBlur?.(valueRef.current)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
        }}
      />
    </div>
  );
}
