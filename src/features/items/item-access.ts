import { hasPermission } from "@/features/workspaces/workspace.permissions";
import type { Prisma, Visibility, WorkspaceRole } from "@/generated/prisma/client";

export function canSeeOthersPrivateItems(role: WorkspaceRole): boolean {
  return hasPermission(role, "editAll");
}

export function itemIsVisibleToUser(
  item: { visibility: Visibility; createdById: string },
  access: { userId: string; canSeeOthersPrivateItems: boolean },
): boolean {
  if (item.visibility !== "PRIVATE") return true;
  if (item.createdById === access.userId) return true;
  return access.canSeeOthersPrivateItems;
}

export function itemVisibilityWhere(
  userId: string,
  canSeePrivateOfOthers: boolean,
): Prisma.ItemWhereInput {
  if (canSeePrivateOfOthers) return {};
  return {
    OR: [
      { visibility: { not: "PRIVATE" } },
      { createdById: userId },
    ],
  };
}
