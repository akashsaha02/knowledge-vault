"use client";

import { Decoration, type DecorationSet, EditorView, ViewPlugin } from "@codemirror/view";
import { Copy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { Button } from "@/components/ui/button";

const variableMark = Decoration.mark({ class: "cm-prompt-variable" });

const variableHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: { docChanged: boolean; view: EditorView }) {
      if (update.docChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      const widgets: ReturnType<typeof variableMark.range>[] = [];
      const text = view.state.doc.toString();
      const regex = /\{\{[^}]+\}\}/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        widgets.push(variableMark.range(match.index, match.index + match[0].length));
      }
      return Decoration.set(widgets);
    }
  },
  { decorations: (v) => v.decorations },
);

type PromptEditorProps = {
  content: string;
  onSave: (content: string) => Promise<void>;
};

export function PromptEditor({ content, onSave }: PromptEditorProps) {
  const [local, setLocal] = useState(content);
  const valueRef = useRef(content);

  useEffect(() => {
    setLocal(content);
    valueRef.current = content;
  }, [content]);

  const extensions = useMemo(() => [variableHighlighter], []);
  const variables = useMemo(() => {
    const matches = local.match(/\{\{([^}]+)\}\}/g) ?? [];
    return [...new Set(matches.map((m) => m.slice(2, -2).trim()))];
  }, [local]);

  return (
    <div className="prompt-editor">
      <div className="editor-toolbar mb-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(local);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
          Copy template
        </Button>
        {variables.length > 0 ? (
          <span className="text-xs text-[var(--muted)]">
            Variables: {variables.map((v) => `{{${v}}}`).join(", ")}
          </span>
        ) : (
          <span className="text-xs text-[var(--muted)]">
            Use {"{{variable}}"} for placeholders
          </span>
        )}
      </div>

      <div className="codemirror-shell prompt-editor-cm">
        <CodeMirror
          value={local}
          height="420px"
          theme={vscodeDark}
          extensions={extensions}
          onChange={(value) => {
            setLocal(value);
            valueRef.current = value;
          }}
          onBlur={() => void onSave(valueRef.current)}
          placeholder="Write your AI prompt template..."
          aria-label="Prompt template"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
        />
      </div>

      {variables.length > 0 ? (
        <div className="prompt-preview-panel">
          <p className="item-section-label">Fill preview</p>
          <div className="prompt-preview-chips">
            {variables.map((variable) => (
              <span key={variable} className="prompt-preview-chip">
                {variable}
              </span>
            ))}
          </div>
          <pre className="prompt-preview-text">{local}</pre>
        </div>
      ) : null}
    </div>
  );
}
