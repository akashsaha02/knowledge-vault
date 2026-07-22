"use client";

import { Button, Result } from "antd";
import { useEffect } from "react";

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
      <Result
        status="error"
        title="Something went wrong"
        subTitle="An unexpected error occurred. You can try again or return home."
        extra={[
          <Button key="retry" type="primary" onClick={reset}>
            Try again
          </Button>,
          <Button key="home" href="/">
            Go home
          </Button>,
        ]}
      />
    </div>
  );
}
