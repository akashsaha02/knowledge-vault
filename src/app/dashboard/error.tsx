"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Dashboard error
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Something went wrong while loading this page.
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
