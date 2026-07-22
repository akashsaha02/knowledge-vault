"use client";

import { CopyOutlined } from "@ant-design/icons";
import { App, Alert, Button, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { detectCommandRisk, RISK_LABELS } from "@/features/items/command.utils";
import { CodeEditor } from "@/components/editor/code-editor";

const SHELLS = ["bash", "zsh", "fish", "powershell", "cmd"];

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
  const { message } = App.useApp();
  const [localCommand, setLocalCommand] = useState(command);
  const [localShell, setLocalShell] = useState(shell);
  const [localUndo, setLocalUndo] = useState(undoCommand ?? "");
  const risk = detectCommandRisk(localCommand);

  useEffect(() => {
    setLocalCommand(command);
    setLocalShell(shell);
    setLocalUndo(undoCommand ?? "");
  }, [command, shell, undoCommand]);

  async function persist(fields?: Partial<{ command: string; shell: string; undoCommand: string }>) {
    await onSave({
      command: fields?.command ?? localCommand,
      shell: fields?.shell ?? localShell,
      undoCommand: fields?.undoCommand ?? localUndo,
    });
  }

  return (
    <div className="command-editor">
      <Space className="mb-3" wrap>
        <Select
          value={localShell}
          onChange={(value) => {
            setLocalShell(value);
            void persist({ shell: value });
          }}
          options={SHELLS.map((s) => ({ value: s, label: s }))}
          style={{ width: 140 }}
          aria-label="Shell type"
        />
        <Button
          icon={<CopyOutlined />}
          onClick={async () => {
            await navigator.clipboard.writeText(localCommand);
            message.success("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Space>

      {risk !== "safe" ? (
        <Alert
          className="mb-3"
          type={risk === "destructive" ? "error" : "warning"}
          message={RISK_LABELS[risk]}
          showIcon
        />
      ) : null}

      <CodeEditor
        value={localCommand}
        onChange={setLocalCommand}
        onSave={async (value) => {
          setLocalCommand(value);
          await persist({ command: value });
        }}
        placeholder="Enter command..."
        rows={4}
        label="Command"
      />

      <div className="mt-4">
        <CodeEditor
          value={localUndo}
          onChange={setLocalUndo}
          onSave={async (value) => {
            setLocalUndo(value);
            await persist({ undoCommand: value });
          }}
          placeholder="Optional undo command..."
          rows={2}
          label="Undo command"
        />
      </div>

      {localCommand ? (
        <pre className="command-preview mt-4" aria-label="Command preview">
          <code>{localCommand}</code>
        </pre>
      ) : null}
    </div>
  );
}
