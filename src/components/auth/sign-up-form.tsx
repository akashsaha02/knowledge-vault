"use client";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { BRAND_NAME } from "@/lib/brand";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!name || !email || !password) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      toast.error(error.message ?? "Sign up failed");
      return;
    }
    toast.success("Account created");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="auth-page-form-card w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-2">Create account</h2>
      <p className="text-sm text-[var(--muted)]">
        Start saving notes, links, and code with {BRAND_NAME}
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]"
              aria-hidden="true"
            />
            <Input id="name" name="name" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]"
              aria-hidden="true"
            />
            <Input id="email" name="email" type="email" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]"
              aria-hidden="true"
            />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className="pl-9 pr-10"
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
          Create account
        </Button>
      </form>

      <div className="flex items-center gap-4 my-4">
        <Separator className="flex-1" />
        <span className="text-sm text-[var(--muted)]">or</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={async () => {
          const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
            errorCallbackURL: "/sign-up",
          });
          if (error) {
            toast.error(error.message ?? "Google sign in failed");
          }
        }}
      >
        Continue with Google
      </Button>

      <p className="text-center mt-4 text-sm">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </Card>
  );
}
