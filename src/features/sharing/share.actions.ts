"use server";

import { createShareLink, revokeShareLink, unlockShareLink } from "@/features/sharing/share.service";
import { requireUser } from "@/lib/session";

export async function createShareLinkAction(
  workspaceId: string,
  options: {
    itemId?: string;
    expiresAt?: string;
    password?: string;
    allowCopy?: boolean;
    allowDownload?: boolean;
  },
) {
  const user = await requireUser();
  return createShareLink(user.id, workspaceId, {
    ...options,
    expiresAt: options.expiresAt ? new Date(options.expiresAt) : undefined,
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
