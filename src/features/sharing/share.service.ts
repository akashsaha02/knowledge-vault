import "server-only";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getAuthSecret } from "@/lib/auth-secret";
import {
  AuthorizationError,
  requireWorkspacePermission,
} from "@/features/workspaces/workspace.service";
import {
  createShareAuthCookieValue,
  shareAuthCookieName,
  verifyShareAuthCookieValue,
} from "@/features/sharing/share-cookie";
import {
  hashSharePassword,
  verifySharePassword,
} from "@/features/sharing/share-password";

export async function createShareLink(
  userId: string,
  workspaceId: string,
  options: {
    itemId?: string;
    expiresAt?: Date;
    password?: string;
    allowCopy?: boolean;
    allowDownload?: boolean;
  },
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");

  if (options.itemId) {
    const item = await db.item.findFirst({
      where: {
        id: options.itemId,
        workspaceId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!item) {
      throw new AuthorizationError("Item not found in this workspace");
    }
  }

  const token = randomBytes(32).toString("hex");

  return db.shareLink.create({
    data: {
      workspaceId,
      itemId: options.itemId,
      token,
      expiresAt: options.expiresAt,
      password: options.password ? hashSharePassword(options.password) : null,
      allowCopy: options.allowCopy ?? false,
      allowDownload: options.allowDownload ?? false,
    },
  });
}

export async function revokeShareLink(
  userId: string,
  workspaceId: string,
  shareLinkId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");

  const link = await db.shareLink.findFirst({
    where: { id: shareLinkId, workspaceId },
  });

  if (!link) {
    throw new AuthorizationError("Share link not found");
  }

  return db.shareLink.update({
    where: { id: link.id },
    data: { revokedAt: new Date() },
  });
}

export async function getShareLinkByToken(token: string) {
  const link = await db.shareLink.findUnique({ where: { token } });
  if (!link || link.revokedAt) return null;
  if (link.expiresAt && link.expiresAt < new Date()) return null;
  return link;
}

async function hasSharePasswordAccess(token: string, linkId: string) {
  const link = await getShareLinkByToken(token);
  if (!link) return false;
  if (!link.password) return true;

  const cookieStore = await cookies();
  const cookie = cookieStore.get(shareAuthCookieName(token));
  if (!cookie?.value) return false;

  return verifyShareAuthCookieValue(
    cookie.value,
    token,
    linkId,
    getAuthSecret(),
  );
}

export async function unlockShareLink(token: string, password: string) {
  const link = await getShareLinkByToken(token);
  if (!link) return { ok: false as const, error: "Link not found" };
  if (!link.password) return { ok: true as const };

  if (!verifySharePassword(password, link.password)) {
    return { ok: false as const, error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(shareAuthCookieName(token), createShareAuthCookieValue(token, link.id, getAuthSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/share/${token}`,
    maxAge: 60 * 60 * 24,
  });

  return { ok: true as const };
}

export type PublicSharedContent =
  | { requiresPassword: true }
  | {
      requiresPassword: false;
      link: NonNullable<Awaited<ReturnType<typeof getShareLinkByToken>>>;
      item: Awaited<ReturnType<typeof loadSharedItem>>;
    };

async function loadSharedItem(
  link: NonNullable<Awaited<ReturnType<typeof getShareLinkByToken>>>,
) {
  if (!link.itemId) return null;

  return db.item.findFirst({
    where: {
      id: link.itemId,
      workspaceId: link.workspaceId,
      deletedAt: null,
    },
    include: {
      tags: { include: { tag: true } },
    },
  });
}

export async function getPublicSharedContent(
  token: string,
): Promise<PublicSharedContent | null> {
  const link = await getShareLinkByToken(token);
  if (!link) return null;

  if (link.password && !(await hasSharePasswordAccess(token, link.id))) {
    return { requiresPassword: true };
  }

  await db.shareLink.update({
    where: { id: link.id },
    data: { viewCount: { increment: 1 } },
  });

  const item = await loadSharedItem(link);

  return { requiresPassword: false, link, item };
}
