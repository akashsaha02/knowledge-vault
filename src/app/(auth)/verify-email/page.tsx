import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center border border-neutral-200 rounded-lg p-8">
        <h1 className="text-2xl font-display font-semibold mb-4">
          Verify your email
        </h1>
        <p className="text-neutral-600 mb-6">
          Check your inbox for a verification link. Once verified, you can access
          your dashboard.
        </p>
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
