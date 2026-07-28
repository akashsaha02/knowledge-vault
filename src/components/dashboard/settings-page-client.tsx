"use client";

import Link from "next/link";
import { Database, Share2, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/dashboard/page-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  exportJsonAction,
  exportZipAction,
  importJsonAction,
} from "@/features/import-export/import-export.actions";
import { createShareLinkAction } from "@/features/sharing/share.actions";

export function SettingsPageClient({
  workspaceId,
  userEmail,
}: {
  workspaceId: string;
  userEmail: string;
}) {
  const [importJson, setImportJson] = useState("");
  const [exporting, setExporting] = useState<"json" | "zip" | null>(null);

  return (
    <PageShell
      title="Settings"
      description="Manage your account and data."
    >
      <div className="page-shell-constrained space-y-6">

        <section aria-labelledby="settings-account">
          <h4
            id="settings-account"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <User className="h-4 w-4" aria-hidden="true" /> My Account
          </h4>
          <Card className="!border-[var(--border)] mt-3">
            <CardContent className="pt-6">
              <p className="text-[var(--muted)]">Signed in as</p>
              <div className="font-medium text-[var(--foreground)] mt-1">
                {userEmail}
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-data">
          <h4
            id="settings-data"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <Database className="h-4 w-4" aria-hidden="true" /> My Data
          </h4>
          <Card className="!border-[var(--border)] mt-3">
            <CardContent className="pt-6">
              <p className="text-[var(--muted)] mb-4">
                Download everything you have saved as a file you can keep.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={exporting === "json"}
                  onClick={async () => {
                    setExporting("json");
                    try {
                      const data = await exportJsonAction(workspaceId);
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "my-notes-export.json";
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Export downloaded");
                    } catch {
                      toast.error("Export failed");
                    } finally {
                      setExporting(null);
                    }
                  }}
                >
                  {exporting === "json" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  Download as JSON
                </Button>
                <Button
                  disabled={exporting === "zip"}
                  onClick={async () => {
                    setExporting("zip");
                    try {
                      const base64 = await exportZipAction(workspaceId);
                      const binary = atob(base64);
                      const bytes = new Uint8Array(binary.length);
                      for (let i = 0; i < binary.length; i++)
                        bytes[i] = binary.charCodeAt(i);
                      const blob = new Blob([bytes], { type: "application/zip" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "my-notes-export.zip";
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Export downloaded");
                    } catch {
                      toast.error("Export failed");
                    } finally {
                      setExporting(null);
                    }
                  }}
                >
                  {exporting === "zip" ? <Loader2 className="animate-spin" /> : null}
                  Download as ZIP
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-sharing">
          <h4
            id="settings-sharing"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" /> Sharing
          </h4>
          <Card className="!border-[var(--border)] mt-3">
            <CardContent className="pt-6">
              <p className="text-[var(--muted)] mb-4">
                Create a read-only link for a specific item. Workspace admins can
                generate links from item settings once an item is selected.
              </p>
              <Button
                onClick={async () => {
                  try {
                    const link = await createShareLinkAction(workspaceId, {});
                    toast.success(`Share link created: /share/${link.token}`);
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Could not create share link",
                    );
                  }
                }}
              >
                Create a share link
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-advanced">
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger
                id="settings-advanced"
                className="py-2 text-[15px] font-semibold hover:no-underline"
              >
                Advanced / Developer tools
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex w-full flex-col gap-6">

                  <Card className="!border-[var(--border)]">
                    <CardHeader>
                      <CardTitle className="text-base">Import data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--muted)] mb-3">
                        Paste a previously exported JSON file to restore your data.
                      </p>
                      <Textarea
                        rows={6}
                        placeholder="Paste JSON here..."
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        aria-label="JSON to import"
                      />
                      <Button
                        className="mt-3"
                        onClick={async () => {
                          try {
                            const result = await importJsonAction(workspaceId, importJson);
                            toast.success(`Imported ${result.imported} items`);
                            setImportJson("");
                          } catch {
                            toast.error("Import failed. Check your JSON format.");
                          }
                        }}
                      >
                        Import
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="!border-[var(--border)]">
                    <CardHeader>
                      <CardTitle className="text-base">Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--muted)] mb-3">
                        Use the full search page to find notes, links, and code across your vault.
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/dashboard/search">Open search</Link>
                      </Button>
                    </CardContent>
                  </Card>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </div>
    </PageShell>
  );
}
