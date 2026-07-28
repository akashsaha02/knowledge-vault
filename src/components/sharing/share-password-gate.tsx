"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_NAME } from "@/lib/brand";
import { unlockShareLinkAction } from "@/features/sharing/share.actions";

export function SharePasswordGate({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="share-page">
      <header className="share-page-header">
        <BrandLogo href="/" variant="lockup" />
      </header>
      <div className="share-page-body">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Password required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--muted)] mb-4">
              This shared link is protected. Enter the password to continue.
            </p>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!password.trim()) {
                  toast.error("Password is required");
                  return;
                }
                setSubmitting(true);
                try {
                  const result = await unlockShareLinkAction(token, password);
                  if (!result.ok) {
                    toast.error(result.error ?? "Incorrect password");
                    return;
                  }
                  router.refresh();
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="share-password">Password</Label>
                <Input
                  id="share-password"
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : null}
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="share-page-footer">
        Powered by {BRAND_NAME}
      </footer>
    </div>
  );
}
