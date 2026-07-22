import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { SearchPageClient } from "@/components/dashboard/search-page-client";

export default async function SearchPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  return <SearchPageClient workspaceId={workspaceId} />;
}
