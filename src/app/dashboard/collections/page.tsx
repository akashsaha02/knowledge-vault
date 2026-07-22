import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { CollectionsPageClient } from "@/components/dashboard/collections-page-client";

export default async function CollectionsPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  return <CollectionsPageClient workspaceId={workspaceId} />;
}
