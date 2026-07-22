"use server";

import { searchItemsSchema } from "@/features/items/item.schema";
import { searchWorkspaceItems } from "@/features/search/search.service";
import { requireUser } from "@/lib/session";

export async function searchAction(input: unknown, useFullText = false) {
  const user = await requireUser();
  const parsed = searchItemsSchema.parse(input);
  return searchWorkspaceItems(user.id, parsed, useFullText);
}
