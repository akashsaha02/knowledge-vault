"use client";

import { CopyOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, App, Button, Select, Space, Tag } from "antd";
import {
  detectCommandRisk,
  RISK_LABELS,
} from "@/features/items/command.utils";

type CommandViewerProps = {
  command: string;
  shell?: string;
  undoCommand?: string;
  onShellChange?: (shell: string) => void;
};

export function CommandViewer({
  command,
  shell = "bash",
  undoCommand,
  onShellChange,
}: CommandViewerProps) {
  const { message } = App.useApp();
  const risk = detectCommandRisk(command);

  return (
    <div className="space-y-3">
      {risk !== "safe" && (
        <Alert
          type={risk === "destructive" ? "error" : "warning"}
          showIcon
          icon={<WarningOutlined />}
          message={RISK_LABELS[risk]}
          description="Review this command carefully before running it."
        />
      )}
      <Space>
        <Select
          value={shell}
          onChange={onShellChange}
          options={["bash", "zsh", "powershell", "fish"].map((s) => ({
            value: s,
            label: s,
          }))}
          style={{ width: 140 }}
        />
        <Tag color={risk === "destructive" ? "red" : risk === "review" ? "orange" : "green"}>
          {RISK_LABELS[risk]}
        </Tag>
        <Button
          icon={<CopyOutlined />}
          onClick={async () => {
            await navigator.clipboard.writeText(command);
            message.success("Command copied");
          }}
        >
          Copy command
        </Button>
      </Space>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
        {command}
      </pre>
      {undoCommand && (
        <div>
          <p className="text-sm text-neutral-500 mb-1">Undo command</p>
          <pre className="bg-neutral-100 p-3 rounded text-sm">{undoCommand}</pre>
        </div>
      )}
    </div>
  );
}
