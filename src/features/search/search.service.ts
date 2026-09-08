import "server-only";

import { searchAccessibleItems } from "@/features/items/item.service";
import type { SearchItemsInput } from "@/features/items/item.schema";

export async function searchWorkspaceItems(
  userId: string,
  input: SearchItemsInput,
  useFullText = false,
) {
  return searchAccessibleItems(userId, input, useFullText);
}
