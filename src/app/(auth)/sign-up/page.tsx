import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getSession } from "@/lib/session";

export default async function SignUpPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <SignUpForm />
    </div>
  );
}
