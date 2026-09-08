import type { ItemStatus } from "@/generated/prisma/client";

export function canPermanentlyDeleteItem(item: {
  status: ItemStatus;
  deletedAt: Date | string | null;
}): boolean {
  return item.status === "TRASHED" && item.deletedAt != null;
}

export function shouldCreateRevision(options: {
  lastRevision?: { createdAt: Date; plainText: string } | null;
  nextPlainText: string;
  now?: number;
  windowMs?: number;
}): boolean {
  const now = options.now ?? Date.now();
  const windowMs = options.windowMs ?? 5 * 60 * 1000;
  const last = options.lastRevision;
  if (!last) return true;
  if (last.createdAt.getTime() < now - windowMs) return true;
  return last.plainText !== options.nextPlainText;
}

export function nextStatusAfterDraftEdit(
  currentStatus: ItemStatus,
  hasContentChange: boolean,
): ItemStatus | undefined {
  if (currentStatus === "DRAFT" && hasContentChange) return "ACTIVE";
  return undefined;
}
