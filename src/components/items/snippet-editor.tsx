"use client";

import { CopyOutlined } from "@ant-design/icons";
import { App, Button, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CodeEditor } from "@/components/editor/code-editor";

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "bash",
  "json",
  "sql",
  "html",
  "css",
  "go",
  "rust",
];

type SnippetEditorProps = {
  code: string;
  language: string;
  onCodeChange: (code: string) => Promise<void>;
  onLanguageChange: (language: string) => Promise<void>;
};

export function SnippetEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: SnippetEditorProps) {
  const { message } = App.useApp();
  const [localCode, setLocalCode] = useState(code);
  const [localLanguage, setLocalLanguage] = useState(language);

  useEffect(() => {
    setLocalCode(code);
    setLocalLanguage(language);
  }, [code, language]);

  return (
    <div>
      <Space className="mb-3" wrap>
        <Select
          value={localLanguage}
          onChange={(value) => {
            setLocalLanguage(value);
            void onLanguageChange(value);
          }}
          options={LANGUAGES.map((l) => ({ value: l, label: l }))}
          style={{ width: 140 }}
          aria-label="Snippet language"
        />
        <Button
          icon={<CopyOutlined />}
          onClick={async () => {
            await navigator.clipboard.writeText(localCode);
            message.success("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Space>
      <CodeEditor
        value={localCode}
        onChange={setLocalCode}
        onSave={onCodeChange}
        placeholder="Paste or write your snippet..."
        rows={12}
      />
      {localCode.trim() ? (
        <div className="mt-4">
          <p className="item-section-label">Preview</p>
          <SyntaxHighlighter
            language={localLanguage}
            style={oneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{ borderRadius: 8, margin: 0 }}
          >
            {localCode}
          </SyntaxHighlighter>
        </div>
      ) : null}
    </div>
  );
}
