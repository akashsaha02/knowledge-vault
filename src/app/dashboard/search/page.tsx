import { listProjectsAction } from "@/features/projects/project.actions";
import { listTagsAction } from "@/features/tags/tag.actions";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { SearchPageClient } from "@/components/dashboard/search-page-client";
import { InlineLoader } from "@/components/ui/content-loader";
import { Suspense } from "react";

export default async function SearchPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  const [projects, tags] = await Promise.all([
    listProjectsAction(workspaceId),
    listTagsAction(workspaceId),
  ]);
  return (
    <Suspense fallback={<InlineLoader />}>
      <SearchPageClient
        workspaceId={workspaceId}
        projects={projects.map((project) => ({ id: project.id, name: project.name }))}
        tags={tags.map((tag) => ({ id: tag.id, name: tag.name }))}
      />
    </Suspense>
  );
}
