"use client";

import { AlertCircle, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";
import { useUiStore } from "@/stores/ui-store";

const LABELS = {
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
} as const;

export function SaveStatusIndicator() {
  const pathname = usePathname();
  const saveStatus = useUiStore((s) => s.saveStatus);
  const setSaveStatus = useUiStore((s) => s.setSaveStatus);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSaveStatus("idle");
  }, [pathname, setSaveStatus]);

  useEffect(() => {
    if (dismissRef.current) {
      clearTimeout(dismissRef.current);
      dismissRef.current = null;
    }

    if (saveStatus === "saved") {
      dismissRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }

    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [saveStatus, setSaveStatus]);

  if (saveStatus === "idle") return null;

  const label = LABELS[saveStatus as keyof typeof LABELS] ?? saveStatus;
  const statusClass =
    saveStatus === "saved"
      ? "save-status-saved"
      : saveStatus === "saving"
        ? "save-status-saving"
        : saveStatus === "error"
          ? "save-status-error"
          : "";

  return (
    <div className="save-status-container" role="status" aria-live="polite">
      <span className={`save-status-badge ${statusClass}`}>
        {saveStatus === "saving" ? <LoadingSpinner size={12} /> : null}
        {saveStatus === "saved" ? <Check className="h-3 w-3" /> : null}
        {saveStatus === "error" ? <AlertCircle className="h-3 w-3" /> : null}
        {label}
      </span>
    </div>
  );
}
