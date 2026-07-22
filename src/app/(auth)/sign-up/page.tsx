import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-6 font-semibold">
        Knowledge Vault
      </Link>
      <SignUpForm />
    </div>
  );
}
