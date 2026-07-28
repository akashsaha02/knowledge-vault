import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type AuthUser = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["user"];

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
