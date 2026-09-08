export function isShareLinkUsable(
  link: {
    revokedAt: Date | string | null;
    expiresAt: Date | string | null;
  },
  now = new Date(),
): boolean {
  if (link.revokedAt) return false;
  if (link.expiresAt && new Date(link.expiresAt) < now) return false;
  return true;
}

export function canCopySharedContent(link: { allowCopy: boolean }): boolean {
  return link.allowCopy;
}
