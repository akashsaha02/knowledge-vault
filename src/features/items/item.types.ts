import type { Item, ItemStatus, ItemType, Prisma } from "@/generated/prisma/client";

export type ItemWithTags = Item & {
  tags: { tag: { id: string; name: string; slug: string; color: string | null } }[];
};

export type ItemListFilters = {
  workspaceId: string;
  type?: ItemType;
  status?: ItemStatus;
  projectId?: string;
  collectionId?: string;
  tagId?: string;
  query?: string;
  limit?: number;
  offset?: number;
  favoritesOnly?: boolean;
};

export type ItemCreateData = Prisma.ItemCreateInput;
export type ItemUpdateData = Prisma.ItemUpdateInput;
