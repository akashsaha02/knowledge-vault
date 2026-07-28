"use client";

import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CodeMirrorEditor } from "@/components/editor/codemirror-editor";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [localCode, setLocalCode] = useState(code);
  const [localLanguage, setLocalLanguage] = useState(language);
  const valueRef = useRef(code);

  useEffect(() => {
    setLocalCode(code);
    valueRef.current = code;
  }, [code]);

  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);

  return (
    <div className="snippet-editor">
      <div className="editor-toolbar mb-3 flex flex-wrap gap-2">
        <Select
          value={localLanguage}
          onValueChange={(value) => {
            setLocalLanguage(value);
            void onLanguageChange(value);
          }}
        >
          <SelectTrigger className="w-[140px]" aria-label="Snippet language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(localCode);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
      <CodeMirrorEditor
        value={localCode}
        language={localLanguage}
        minHeight="480px"
        placeholder="Paste or write your snippet..."
        aria-label="Code snippet"
        onChange={(value) => {
          setLocalCode(value);
          valueRef.current = value;
        }}
        onBlur={() => void onCodeChange(valueRef.current)}
      />
    </div>
  );
}
