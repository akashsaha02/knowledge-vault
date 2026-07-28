import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getSession } from "@/lib/session";

export default async function SignInPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <SignInForm />
    </div>
  );
}
