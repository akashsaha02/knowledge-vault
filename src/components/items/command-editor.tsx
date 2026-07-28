"use client";

import { AlertTriangle, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { detectCommandRisk, RISK_LABELS } from "@/features/items/command.utils";
import { CodeMirrorEditor } from "@/components/editor/codemirror-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SHELLS = ["bash", "zsh", "fish", "powershell", "cmd"] as const;

const SHELL_PROMPTS: Record<string, string> = {
  bash: "$",
  zsh: "$",
  fish: ">",
  powershell: "PS>",
  cmd: ">",
};

type CommandEditorProps = {
  command: string;
  shell?: string;
  undoCommand?: string;
  onSave: (data: {
    command: string;
    shell: string;
    undoCommand?: string;
  }) => Promise<void>;
};

export function CommandEditor({
  command,
  shell = "bash",
  undoCommand = "",
  onSave,
}: CommandEditorProps) {
  const [localCommand, setLocalCommand] = useState(command);
  const [localShell, setLocalShell] = useState(shell);
  const [localUndo, setLocalUndo] = useState(undoCommand ?? "");
  const commandRef = useRef(command);
  const undoRef = useRef(undoCommand ?? "");
  const risk = detectCommandRisk(localCommand);
  const prompt = SHELL_PROMPTS[localShell] ?? "$";

  useEffect(() => {
    setLocalCommand(command);
    commandRef.current = command;
  }, [command]);

  useEffect(() => {
    setLocalShell(shell);
  }, [shell]);

  useEffect(() => {
    setLocalUndo(undoCommand ?? "");
    undoRef.current = undoCommand ?? "";
  }, [undoCommand]);

  async function persist(fields?: Partial<{ command: string; shell: string; undoCommand: string }>) {
    await onSave({
      command: fields?.command ?? commandRef.current,
      shell: fields?.shell ?? localShell,
      undoCommand: fields?.undoCommand ?? undoRef.current,
    });
  }

  return (
    <div className="command-editor terminal-editor">
      <div className="terminal-editor-header">
        <Select
          value={localShell}
          onValueChange={(value) => {
            setLocalShell(value);
            void persist({ shell: value });
          }}
        >
          <SelectTrigger className="w-[140px] terminal-shell-select" aria-label="Shell type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHELLS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge
          variant="outline"
          className={
            risk === "destructive"
              ? "terminal-risk terminal-risk--destructive"
              : risk === "review"
                ? "terminal-risk terminal-risk--review"
                : "terminal-risk terminal-risk--safe"
          }
        >
          {RISK_LABELS[risk]}
        </Badge>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(localCommand);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>

      {risk !== "safe" ? (
        <div className="terminal-risk-banner" role="alert">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{RISK_LABELS[risk]}</span>
        </div>
      ) : null}

      <div className="terminal-panel">
        <div className="terminal-panel-bar">
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--yellow" />
          <span className="terminal-dot terminal-dot--green" />
          <span className="terminal-panel-title">{localShell}</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-prompt">{prompt}</span>
          <div className="terminal-input-wrap">
            <CodeMirrorEditor
              value={localCommand}
              language="bash"
              minHeight="120px"
              placeholder="Enter command..."
              aria-label="Command"
              className="terminal-cm"
              onChange={(value) => {
                setLocalCommand(value);
                commandRef.current = value;
              }}
              onBlur={() => void persist({ command: commandRef.current })}
            />
          </div>
        </div>
        <div className="terminal-line terminal-line--undo">
          <span className="terminal-prompt terminal-prompt--muted">undo:</span>
          <div className="terminal-input-wrap">
            <CodeMirrorEditor
              value={localUndo}
              language="bash"
              minHeight="72px"
              placeholder="Optional undo command..."
              aria-label="Undo command"
              className="terminal-cm"
              onChange={(value) => {
                setLocalUndo(value);
                undoRef.current = value;
              }}
              onBlur={() => void persist({ undoCommand: undoRef.current })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
