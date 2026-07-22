"use server";

import { fetchBookmarkMetadata } from "@/features/items/bookmark.service";
import { createItemForUser } from "@/features/items/item.service";
import { requireUser } from "@/lib/session";

export async function createBookmarkAction(workspaceId: string, url: string) {
  const user = await requireUser();
  const metadata = await fetchBookmarkMetadata(url);

  return createItemForUser(user.id, {
    workspaceId,
    type: "BOOKMARK",
    title: metadata.title,
    plainText: metadata.plainText,
    metadata: {
      url: metadata.url,
      faviconUrl: metadata.faviconUrl,
      previewImageUrl: metadata.previewImageUrl,
      siteName: metadata.siteName,
      description: metadata.description,
    },
  });
}

export async function previewBookmarkAction(url: string) {
  await requireUser();
  return fetchBookmarkMetadata(url);
}
