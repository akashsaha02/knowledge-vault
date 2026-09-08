import { notFound } from "next/navigation";
import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";
import { getProjectForUser } from "@/features/projects/project.service";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) notFound();

  const project = await getProjectForUser(user.id, workspaceId, projectId);
  if (!project) notFound();

  return (
    <DashboardItemPage
      title={project.name}
      description={
        project.description ??
        "All notes, snippets, and links in this project."
      }
      emptyDescription="Nothing in this project yet."
      projectId={project.id}
    />
  );
}
