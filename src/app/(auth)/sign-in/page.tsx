import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function SignInPage() {
  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <SignInForm />
    </div>
  );
}
