"use client";

import { App, Button, Card, Input, Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import {
  exportJsonAction,
  exportZipAction,
  importJsonAction,
} from "@/features/import-export/import-export.actions";
import { askVaultAction } from "@/features/ai/ai.actions";
import { createShareLinkAction } from "@/features/sharing/share.actions";

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
    <PageShell
      title="Settings"
      description="Manage your account, import and export data, and configure workspace options."
    >
      <div className="page-shell-constrained space-y-4">
        <Card title="Account" className="!border-[var(--border)]">
          <Text className="text-[var(--muted)]">Signed in as</Text>
          <div className="font-medium text-[var(--foreground)]">{userEmail}</div>
        </Card>

        <Card title="Import / Export" className="!border-[var(--border)]">
          <Space orientation="vertical" className="w-full" size="middle">
            <Space wrap>
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
                  for (let i = 0; i < binary.length; i++)
                    bytes[i] = binary.charCodeAt(i);
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
            </Space>
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

        <Card title="Ask Your Vault" className="!border-[var(--border)]">
          <Space orientation="vertical" className="w-full" size="middle">
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
            {aiAnswer ? <Paragraph className="!mb-0">{aiAnswer}</Paragraph> : null}
          </Space>
        </Card>

        <Card title="Sharing" className="!border-[var(--border)]">
          <Paragraph className="!text-[var(--muted)]">
            Generate a share link for read-only access to your workspace.
          </Paragraph>
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
    </PageShell>
  );
}
