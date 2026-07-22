import "server-only";

import { findOrCreateTag, findTags } from "@/features/tags/tag.repository";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { slugify } from "@/lib/slug";

export async function listTags(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  return findTags(workspaceId);
}

export async function createTagForUser(
  userId: string,
  workspaceId: string,
  name: string,
  color?: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "create");
  const slug = slugify(name);
  return findOrCreateTag(workspaceId, name, slug);
}
