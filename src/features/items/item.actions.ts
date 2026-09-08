"use server";

import { revalidatePath } from "next/cache";
import {
  archiveItem,
  createItemForUser,
  getItemRevisions,
  listAccessibleItems,
  permanentlyDeleteItem,
  restoreItem,
  trashItem,
  updateItemForUser,
} from "@/features/items/item.service";
import {
  createItemSchema,
  updateItemSchema,
} from "@/features/items/item.schema";
import type { ItemType } from "@/generated/prisma/client";
import { requireUser } from "@/lib/session";
import type { ItemListFilters } from "@/features/items/item.types";
import { TYPE_ROUTES } from "@/lib/nav-config";

function revalidateItemPaths(type?: ItemType) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/trash");
  revalidatePath("/dashboard/archive");
  if (!type) return;
  const route = TYPE_ROUTES[type];
  if (route) {
    revalidatePath(route.split("?")[0]);
  }
}

export async function listItemsAction(filters: ItemListFilters) {
  const user = await requireUser();
  return listAccessibleItems(user.id, filters);
}

export async function createItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = createItemSchema.parse(input);
  const item = await createItemForUser(user.id, parsed);
  revalidateItemPaths(parsed.type);
  return item;
}

export async function updateItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = updateItemSchema.parse(input);
  const item = await updateItemForUser(user.id, parsed);
  revalidateItemPaths(item.type);
  return item;
}

export async function archiveItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await archiveItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return item;
}

export async function restoreItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await restoreItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return item;
}

export async function trashItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await trashItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return item;
}

export async function permanentlyDeleteItemAction(
  workspaceId: string,
  itemId: string,
) {
  const user = await requireUser();
  const item = await permanentlyDeleteItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return { deleted: true };
}

export async function getRevisionsAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return getItemRevisions(user.id, workspaceId, itemId);
}
