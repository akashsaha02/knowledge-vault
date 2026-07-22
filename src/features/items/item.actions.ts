"use server";

import { revalidatePath } from "next/cache";
import {
  archiveItem,
  createItemForUser,
  getAccessibleItem,
  getItemRevisions,
  listAccessibleItems,
  restoreItem,
  trashItem,
  updateItemForUser,
} from "@/features/items/item.service";
import {
  createItemSchema,
  searchItemsSchema,
  updateItemSchema,
} from "@/features/items/item.schema";
import { requireUser } from "@/lib/session";
import type { ItemListFilters } from "@/features/items/item.types";

export async function listItemsAction(filters: ItemListFilters) {
  const user = await requireUser();
  return listAccessibleItems(user.id, filters);
}

export async function getItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return getAccessibleItem(user.id, workspaceId, itemId);
}

export async function createItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = createItemSchema.parse(input);
  const item = await createItemForUser(user.id, parsed);
  revalidatePath("/dashboard");
  return item;
}

export async function updateItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = updateItemSchema.parse(input);
  const item = await updateItemForUser(user.id, parsed);
  revalidatePath("/dashboard");
  return item;
}

export async function archiveItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await archiveItem(user.id, workspaceId, itemId);
  revalidatePath("/dashboard");
  return item;
}

export async function restoreItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await restoreItem(user.id, workspaceId, itemId);
  revalidatePath("/dashboard");
  return item;
}

export async function trashItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await trashItem(user.id, workspaceId, itemId);
  revalidatePath("/dashboard");
  return item;
}

export async function getRevisionsAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return getItemRevisions(user.id, workspaceId, itemId);
}

export async function searchItemsAction(input: unknown) {
  const user = await requireUser();
  const parsed = searchItemsSchema.parse(input);
  return listAccessibleItems(user.id, parsed);
}
