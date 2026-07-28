"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type FriendlyConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function FriendlyConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: FriendlyConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent className="max-w-[360px]">
        <div className="friendly-confirm-content">
          <div className="friendly-confirm-icon" aria-hidden="true">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <h3 className="friendly-confirm-title">{title}</h3>
          <p className="friendly-confirm-body">{description}</p>
        </div>
        <div className="friendly-confirm-actions">
          <Button onClick={onCancel} variant="secondary" style={{ minWidth: 100 }}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={onConfirm}
            style={{ minWidth: 100 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
