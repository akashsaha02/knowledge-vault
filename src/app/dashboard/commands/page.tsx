import { redirect } from "next/navigation";

export default function CommandsPage() {
  redirect("/dashboard/snippets?tab=commands");
}
