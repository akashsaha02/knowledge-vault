import type { ItemStatus, ItemType } from "@/generated/prisma/client";

export type ItemListFilters = {
  workspaceId: string;
  userId?: string;
  canSeeOthersPrivateItems?: boolean;
  type?: ItemType;
  types?: ItemType[];
  status?: ItemStatus;
  projectId?: string;
  collectionId?: string;
  tagId?: string;
  query?: string;
  limit?: number;
  offset?: number;
  favoritesOnly?: boolean;
};
