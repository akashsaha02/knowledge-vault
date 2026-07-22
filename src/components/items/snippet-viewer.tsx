"use client";

import { CopyOutlined } from "@ant-design/icons";
import { App, Button, Select, Space, Typography } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Text } = Typography;

type SnippetViewerProps = {
  code: string;
  language?: string;
  onLanguageChange?: (lang: string) => void;
};

export function SnippetViewer({
  code,
  language = "typescript",
  onLanguageChange,
}: SnippetViewerProps) {
  const { message } = App.useApp();

  return (
    <div>
      <Space className="mb-2">
        <Select
          value={language}
          onChange={onLanguageChange}
          options={[
            "typescript",
            "javascript",
            "python",
            "bash",
            "json",
            "sql",
          ].map((l) => ({ value: l, label: l }))}
          style={{ width: 140 }}
        />
        <Button
          icon={<CopyOutlined />}
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            message.success("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Space>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{ borderRadius: 8, margin: 0 }}
      >
        {code}
      </SyntaxHighlighter>
      <Text type="secondary" className="text-xs mt-2 block">
        {code.split("\n").length} lines
      </Text>
    </div>
  );
}
