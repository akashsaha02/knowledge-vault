import { TagsPageClient } from "@/components/dashboard/tags-page-client";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function TagsPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  return <TagsPageClient workspaceId={workspaceId} />;
}
