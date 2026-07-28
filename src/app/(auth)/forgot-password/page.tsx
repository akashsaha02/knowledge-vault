"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    if (!email) return;

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message ?? "Request failed");
      return;
    }
    toast.success("Check your email for reset instructions");
  }

  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <Card className="auth-page-form-card w-full max-w-md">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Reset password</h3>
        <form className="mt-4 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          <Link href="/sign-in" className="text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
