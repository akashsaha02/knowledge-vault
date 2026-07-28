"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          An unexpected error occurred. You can try again or return home.
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
