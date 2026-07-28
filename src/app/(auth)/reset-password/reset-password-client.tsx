"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (error) {
      toast.error(error.message ?? "Reset failed");
      return;
    }
    toast.success("Password updated");
  }

  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <div className="auth-page-form-card">
        <h1 className="auth-page-title">Set new password</h1>
        <p className="auth-page-description">
          Choose a strong password with at least 8 characters.
        </p>
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update password
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/sign-in" className="auth-page-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
