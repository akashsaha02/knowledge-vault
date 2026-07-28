import { SignUpForm } from "@/components/auth/sign-up-form";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <SignUpForm />
    </div>
  );
}
