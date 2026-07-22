import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { SettingsPageClient } from "@/components/dashboard/settings-page-client";

export default async function SettingsPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  return <SettingsPageClient workspaceId={workspaceId} userEmail={user.email} />;
}
