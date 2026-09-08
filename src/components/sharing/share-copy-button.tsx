"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

export function ShareCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        try {
          await copyToClipboard(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error("Could not copy");
        }
      }}
    >
      {copied ? "Copied!" : "Copy content"}
    </Button>
  );
}
