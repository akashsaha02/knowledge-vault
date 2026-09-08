"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardError({
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
    <div className="dashboard-error">
      <EmptyState
        illustration="error"
        title="This page had a problem"
        description="Something went wrong while loading. You can try again, or head back home."
        primaryAction={{
          label: "Try again",
          onClick: reset,
        }}
        secondaryAction={{
          label: "Back to dashboard",
          href: "/dashboard",
        }}
      />
    </div>
  );
}
