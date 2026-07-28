"use client";

import { Info } from "lucide-react";
import { useState, type ReactNode } from "react";

type DetailsSidePanelProps = {
  children: ReactNode;
};

export function DetailsSidePanel({ children }: DetailsSidePanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="details-side-panel">
      <button
        type="button"
        className="details-panel-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Info className="h-4 w-4" aria-hidden="true" />
        {open ? "Hide details" : "Details"}
      </button>

      {open ? (
        <div className="details-panel-body" role="region" aria-label="Item details">
          {children}
        </div>
      ) : null}
    </div>
  );
}
