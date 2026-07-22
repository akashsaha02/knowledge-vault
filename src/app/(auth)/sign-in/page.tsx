import { ThemeToggle } from "@/components/theme-toggle";
import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)] relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="mb-6 font-semibold font-mono text-[var(--accent)]">
        Knowledge Vault
      </Link>
      <SignInForm />
    </div>
  );
}
