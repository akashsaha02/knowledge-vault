export function assertValidAttachmentStorageKey(
  storageKey: string,
  workspaceId: string,
  userId: string,
  itemId: string,
) {
  if (storageKey.includes("..")) {
    throw new Error("Invalid storage key");
  }

  const expectedPrefix = `${workspaceId}/${userId}/${itemId}/`;
  if (!storageKey.startsWith(expectedPrefix)) {
    throw new Error("Invalid storage key");
  }
}
