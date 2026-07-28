import { redirect } from "next/navigation";
import { LandingShell } from "@/components/landing-shell";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LandingShell />;
}
