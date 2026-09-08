"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <EmptyState
        illustration="error"
        title="Something went wrong"
        description="An unexpected error occurred. You can try again or return home."
        primaryAction={{
          label: "Try again",
          onClick: reset,
        }}
        secondaryAction={{
          label: "Go home",
          href: "/",
        }}
      />
    </div>
  );
}
