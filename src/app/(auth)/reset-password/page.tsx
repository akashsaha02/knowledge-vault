import { Suspense } from "react";
import { Spin } from "antd";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spin className="m-8" />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
