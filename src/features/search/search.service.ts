import "server-only";

import { findItems, searchItemsFullText } from "@/features/items/item.repository";
import { requireWorkspaceMember } from "@/features/workspaces/workspace.service";
import type { SearchItemsInput } from "@/features/items/item.schema";

export async function searchWorkspaceItems(
  userId: string,
  input: SearchItemsInput,
  useFullText = false,
) {
  await requireWorkspaceMember(userId, input.workspaceId);

  if (useFullText && input.query?.trim()) {
    try {
      return searchItemsFullText(input.workspaceId, input.query, {
        type: input.type,
        status: input.status,
      });
    } catch {
      // Fall back to simple search if FTS not yet migrated
    }
  }

  return findItems({
    workspaceId: input.workspaceId,
    userId,
    query: input.query,
    type: input.type,
    status: input.status,
    projectId: input.projectId,
    collectionId: input.collectionId,
    tagId: input.tagId,
    limit: input.limit,
  });
}
