"use client";

import Link from "next/link";
import { Database, Palette, Share2, SlidersHorizontal, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  exportJsonAction,
  exportZipAction,
  importJsonAction,
} from "@/features/import-export/import-export.actions";
import { getActionErrorMessage } from "@/lib/action-error";

export function SettingsPageClient({
  workspaceId,
  userEmail,
}: {
  workspaceId: string;
  userEmail: string;
}) {
  const [importJson, setImportJson] = useState("");
  const [exporting, setExporting] = useState<"json" | "zip" | null>(null);
  const [importing, setImporting] = useState(false);

  return (
    <PageShell
      title="Settings"
      description="Account, data, and how Nook looks."
    >
      <div className="page-shell-constrained space-y-8">
        <section aria-labelledby="settings-account">
          <h2 id="settings-account" className="settings-section-title">
            <User className="h-4 w-4" aria-hidden="true" /> Account
          </h2>
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
          <h2 id="settings-data" className="settings-section-title">
            <Database className="h-4 w-4" aria-hidden="true" /> Data
          </h2>
          <Card className="!border-[var(--border)] mt-3">
            <CardHeader>
              <CardTitle className="text-base">Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--muted)] mb-4">
                Download a copy of your Nook. JSON is the format you can import again.
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
                      a.download = "nook-export.json";
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Export downloaded");
                    } catch (error) {
                      toast.error(getActionErrorMessage(error, "Export failed"));
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
                  Download JSON
                </Button>
                <Button
                  variant="secondary"
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
                      a.download = "nook-export.zip";
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Export downloaded");
                    } catch (error) {
                      toast.error(getActionErrorMessage(error, "Export failed"));
                    } finally {
                      setExporting(null);
                    }
                  }}
                >
                  {exporting === "zip" ? <Loader2 className="animate-spin" /> : null}
                  Download ZIP
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-preferences">
          <h2 id="settings-preferences" className="settings-section-title">
            <Palette className="h-4 w-4" aria-hidden="true" /> Preferences
          </h2>
          <Card className="!border-[var(--border)] mt-3">
            <CardContent className="pt-6">
              <p className="text-[var(--muted)] mb-3">Appearance</p>
              <ThemeToggle />
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-sharing">
          <h2 id="settings-sharing" className="settings-section-title">
            <Share2 className="h-4 w-4" aria-hidden="true" /> Sharing
          </h2>
          <Card className="!border-[var(--border)] mt-3">
            <CardContent className="pt-6">
              <p className="text-[var(--muted)]">
                Sharing happens from the item itself. Open something and choose Share
                to create a link with optional password, expiry, and copy permission.
              </p>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="settings-advanced">
          <h2 id="settings-advanced" className="settings-section-title">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Advanced
          </h2>
          <Card className="!border-[var(--border)] mt-3">
            <CardHeader>
              <CardTitle className="text-base">Import JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--muted)] mb-3">
                Paste a Nook export (`version: 1`). Invalid types and oversized
                payloads are rejected.
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
                disabled={importing || !importJson.trim()}
                onClick={async () => {
                  setImporting(true);
                  try {
                    const result = await importJsonAction(workspaceId, importJson);
                    toast.success(`Imported ${result.imported} items`);
                    setImportJson("");
                  } catch (error) {
                    toast.error(
                      getActionErrorMessage(error, "Import failed. Check your JSON format."),
                    );
                  } finally {
                    setImporting(false);
                  }
                }}
              >
                {importing ? <Loader2 className="animate-spin" /> : null}
                Import
              </Button>
            </CardContent>
          </Card>

          <Card className="!border-[var(--border)] mt-4">
            <CardHeader>
              <CardTitle className="text-base">Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--muted)] mb-3">
                Deep retrieval with type, project, and tag filters lives on the search page.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/search">Open search</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
