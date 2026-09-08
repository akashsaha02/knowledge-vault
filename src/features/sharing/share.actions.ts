"use server";

import { createShareLinkSchema } from "@/features/sharing/share.schema";
import { createShareLink, revokeShareLink, unlockShareLink } from "@/features/sharing/share.service";
import { requireUser } from "@/lib/session";

export async function createShareLinkAction(input: unknown) {
  const user = await requireUser();
  const parsed = createShareLinkSchema.parse(input);
  return createShareLink(user.id, parsed.workspaceId, {
    itemId: parsed.itemId,
    expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
    password: parsed.password,
    allowCopy: parsed.allowCopy,
    allowDownload: parsed.allowDownload,
  });
}

export async function revokeShareLinkAction(
  workspaceId: string,
  shareLinkId: string,
) {
  const user = await requireUser();
  return revokeShareLink(user.id, workspaceId, shareLinkId);
}

export async function unlockShareLinkAction(token: string, password: string) {
  return unlockShareLink(token, password);
}
