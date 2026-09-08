import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { listItemsAction } from "@/features/items/item.actions";
import { listProjectsAction } from "@/features/projects/project.actions";
import { listTagsAction } from "@/features/tags/tag.actions";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  const [items, projects, tags] = await Promise.all([
    listItemsAction({ workspaceId, status: "ACTIVE", limit: 8 }),
    listProjectsAction(workspaceId),
    listTagsAction(workspaceId),
  ]);

  const [notes, snippets, bookmarks] = await Promise.all([
    listItemsAction({ workspaceId, type: "NOTE", status: "ACTIVE", limit: 1 }),
    listItemsAction({ workspaceId, type: "SNIPPET", status: "ACTIVE", limit: 1 }),
    listItemsAction({ workspaceId, type: "BOOKMARK", status: "ACTIVE", limit: 1 }),
  ]);

  return (
    <DashboardHome
      userName={user.name}
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
        hasNote: notes.length > 0,
        hasSnippet: snippets.length > 0,
        hasBookmark: bookmarks.length > 0,
        hasProject: projects.length > 0,
        hasTag: tags.length > 0,
      }}
    />
  );
}
