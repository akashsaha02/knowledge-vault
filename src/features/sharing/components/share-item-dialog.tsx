"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShareLinkAction } from "@/features/sharing/share.actions";
import { getActionErrorMessage } from "@/lib/action-error";
import { copyToClipboard } from "@/lib/clipboard";

type ShareItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  itemId: string;
  itemTitle: string;
};

function expiryIso(value: string): string | undefined {
  if (value === "never") return undefined;
  const days = Number(value);
  if (!Number.isFinite(days) || days <= 0) return undefined;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function ShareItemDialog({
  open,
  onOpenChange,
  workspaceId,
  itemId,
  itemTitle,
}: ShareItemDialogProps) {
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("never");
  const [allowCopy, setAllowCopy] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  function reset() {
    setPassword("");
    setExpiry("never");
    setAllowCopy(true);
    setShareUrl(null);
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const link = await createShareLinkAction({
        workspaceId,
        itemId,
        password: password.trim() || undefined,
        expiresAt: expiryIso(expiry),
        allowCopy,
      });
      const origin = window.location.origin;
      const url = `${origin}/share/${link.token}`;
      setShareUrl(url);
      toast.success("Share link created");
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Could not create share link"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Create a link for “{itemTitle || "Untitled"}”. Anyone with the link
            can view it. Optional: password, expiry, and whether copying is allowed.
          </DialogDescription>
        </DialogHeader>

        {shareUrl ? (
          <div className="space-y-3">
            <Label htmlFor="share-url">Public link</Label>
            <div className="flex gap-2">
              <Input id="share-url" readOnly value={shareUrl} />
              <Button type="button" onClick={() => void copyToClipboard(shareUrl, "Link copied")}>
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-password">Password (optional)</Label>
              <Input
                id="share-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave blank for no password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="share-expiry">Expires</Label>
              <select
                id="share-expiry"
                className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
              >
                <option value="never">Never</option>
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={allowCopy}
                onCheckedChange={(checked) => setAllowCopy(checked === true)}
              />
              Allow copying content
            </label>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {shareUrl ? null : (
            <Button type="button" disabled={creating} onClick={() => void handleCreate()}>
              Create link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
