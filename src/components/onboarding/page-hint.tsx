"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type PageHintProps = {
  id: string;
  children: string;
};

export function PageHint({ id, children }: PageHintProps) {
  const storageKey = `nook-hint-${id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(storageKey) !== "1");
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  if (!visible) return null;

  return (
    <aside className="page-hint" role="note">
      <p className="page-hint-text">{children}</p>
      <Button
        variant="ghost"
        size="icon"
        className="page-hint-dismiss h-8 w-8"
        aria-label="Dismiss hint"
        onClick={() => {
          try {
            localStorage.setItem(storageKey, "1");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </aside>
  );
}
