"use client";

import { App, Button, Card, Input, Space, Typography } from "antd";
import { useState } from "react";
import {
  exportJsonAction,
  exportZipAction,
  importJsonAction,
} from "@/features/import-export/import-export.actions";
import { askVaultAction } from "@/features/ai/ai.actions";
import { createShareLinkAction } from "@/features/sharing/share.actions";

const { Title, Paragraph, Text } = Typography;

export function SettingsPageClient({
  workspaceId,
  userEmail,
}: {
  workspaceId: string;
  userEmail: string;
}) {
  const { message } = App.useApp();
  const [importJson, setImportJson] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <Title level={3}>Settings</Title>
      <Card title="Account">
        <Text>Email: {userEmail}</Text>
      </Card>

      <Card title="Import / Export">
        <Space direction="vertical" className="w-full">
          <Button
            onClick={async () => {
              const data = await exportJsonAction(workspaceId);
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "vault-export.json";
              a.click();
            }}
          >
            Export JSON
          </Button>
          <Button
            onClick={async () => {
              const base64 = await exportZipAction(workspaceId);
              const binary = atob(base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const blob = new Blob([bytes], { type: "application/zip" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "vault-export.zip";
              a.click();
            }}
          >
            Export ZIP
          </Button>
          <Input.TextArea
            rows={6}
            placeholder="Paste JSON to import..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
          />
          <Button
            type="primary"
            onClick={async () => {
              const result = await importJsonAction(workspaceId, importJson);
              message.success(`Imported ${result.imported} items`);
            }}
          >
            Import JSON
          </Button>
        </Space>
      </Card>

      <Card title="Ask Your Vault">
        <Space direction="vertical" className="w-full">
          <Input.TextArea
            rows={3}
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask a question about your vault..."
          />
          <Button
            type="primary"
            onClick={async () => {
              const result = await askVaultAction(workspaceId, aiQuestion);
              setAiAnswer(result.answer);
            }}
          >
            Ask
          </Button>
          {aiAnswer && <Paragraph>{aiAnswer}</Paragraph>}
        </Space>
      </Card>

      <Card title="Sharing">
        <Button
          onClick={async () => {
            const link = await createShareLinkAction(workspaceId, {});
            message.success(`Share link created: /share/${link.token}`);
          }}
        >
          Create workspace share link
        </Button>
      </Card>
    </div>
  );
}
