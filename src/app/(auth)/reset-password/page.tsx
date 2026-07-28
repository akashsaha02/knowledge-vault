import { Suspense } from "react";
import { InlineLoader } from "@/components/ui/content-loader";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
