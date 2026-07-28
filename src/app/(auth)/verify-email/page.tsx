import { BrandLogo } from "@/components/brand/brand-logo";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <BrandLogo href="/" variant="lockup" className="auth-brand-logo" />
      <div className="auth-page-card">
        <h1 className="auth-page-title">Verify your email</h1>
        <p className="auth-page-description">
          Check your inbox for a verification link. Once verified, you can access
          your dashboard.
        </p>
        <Link href="/sign-in" className="auth-page-link">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
