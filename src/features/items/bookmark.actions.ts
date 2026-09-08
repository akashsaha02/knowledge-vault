"use server";

import { fetchBookmarkMetadata } from "@/features/items/bookmark.service";
import { requireUser } from "@/lib/session";

export async function previewBookmarkAction(url: string) {
  await requireUser();
  return fetchBookmarkMetadata(url);
}
