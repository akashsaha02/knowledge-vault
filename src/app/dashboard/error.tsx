"use client";

import { Button, Result } from "antd";
import { useEffect } from "react";

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
      <Result
        status="error"
        title="Dashboard error"
        subTitle="Something went wrong while loading this page."
        extra={[
          <Button key="retry" type="primary" onClick={reset}>
            Try again
          </Button>,
          <Button key="dashboard" href="/dashboard">
            Back to dashboard
          </Button>,
        ]}
      />
    </div>
  );
}
