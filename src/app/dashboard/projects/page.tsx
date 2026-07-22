import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { ProjectsPageClient } from "@/components/dashboard/projects-page-client";

export default async function ProjectsPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  return <ProjectsPageClient workspaceId={workspaceId} />;
}
