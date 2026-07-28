import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  bootstrapPersonalWorkspace,
  getActiveWorkspace,
  getUserWorkspaces,
} from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  let workspaceId = await getActiveWorkspace(user.id);

  if (!workspaceId) {
    await bootstrapPersonalWorkspace(user.id, user.name || "User");
    workspaceId = await getActiveWorkspace(user.id);
  }

  if (!workspaceId) {
    redirect("/sign-up");
  }

  const memberships = await getUserWorkspaces(user.id);
  const current = memberships.find((m) => m.workspaceId === workspaceId);

  return (
    <DashboardShell
      userName={user.name}
      workspaceId={workspaceId}
      workspaceName={current?.workspace.name ?? "Workspace"}
    >
      {children}
    </DashboardShell>
  );
}
