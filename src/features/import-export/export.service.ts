import "server-only";

import JSZip from "jszip";
import { listAccessibleItems } from "@/features/items/item.service";
import { requireWorkspaceMember } from "@/features/workspaces/workspace.service";

export async function exportWorkspaceJson(userId: string, workspaceId: string) {
  await requireWorkspaceMember(userId, workspaceId);
  const items = await listAccessibleItems(userId, { workspaceId, limit: 1000 });

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    workspaceId,
    items: items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      plainText: item.plainText,
      content: item.content,
      metadata: item.metadata,
      status: item.status,
      tags: item.tags.map((t) => t.tag.name),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  };
}

export async function exportWorkspaceZip(userId: string, workspaceId: string) {
  const data = await exportWorkspaceJson(userId, workspaceId);
  const zip = new JSZip();

  zip.file("manifest.json", JSON.stringify(data, null, 2));

  for (const item of data.items) {
    const folder =
      item.type === "NOTE"
        ? "notes"
        : item.type === "SNIPPET"
          ? "snippets"
          : item.type === "BOOKMARK"
            ? "bookmarks"
            : "other";
    const fileName = `${folder}/${item.slug}.json`;
    zip.file(fileName, JSON.stringify(item, null, 2));
    if (item.plainText) {
      zip.file(`${folder}/${item.slug}.md`, item.plainText);
    }
  }

  return zip.generateAsync({ type: "base64" });
}
