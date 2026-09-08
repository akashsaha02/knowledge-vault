import { DashboardHome } from "@/components/dashboard/dashboard-home";
import {
  countItemsByTypeAction,
  listItemsAction,
} from "@/features/items/item.actions";
import { listProjectsAction } from "@/features/projects/project.actions";
import { listTagsAction } from "@/features/tags/tag.actions";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  const [items, projects, tags, typeCounts] = await Promise.all([
    listItemsAction({ workspaceId, status: "ACTIVE", limit: 8 }),
    listProjectsAction(workspaceId),
    listTagsAction(workspaceId),
    countItemsByTypeAction(workspaceId),
  ]);

  const noteCount = typeCounts.NOTE ?? 0;
  const snippetCount = (typeCounts.SNIPPET ?? 0) + (typeCounts.COMMAND ?? 0);
  const bookmarkCount = typeCounts.BOOKMARK ?? 0;

  return (
    <DashboardHome
      userName={user.name}
      userImage={user.image}
      workspaceId={workspaceId}
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        plainText: item.plainText,
        updatedAt: item.updatedAt,
        isPinned: item.isPinned,
        projectName: item.project?.name ?? undefined,
      }))}
      stats={{
        hasNote: noteCount > 0,
        hasSnippet: snippetCount > 0,
        hasBookmark: bookmarkCount > 0,
        hasProject: projects.length > 0,
        hasTag: tags.length > 0,
        noteCount,
        snippetCount,
        bookmarkCount,
        projectCount: projects.length,
      }}
    />
  );
}
