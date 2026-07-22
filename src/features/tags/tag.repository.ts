import { db } from "@/lib/db";

export async function findTags(workspaceId: string) {
  return db.tag.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function createTag(
  workspaceId: string,
  name: string,
  slug: string,
  color?: string,
) {
  return db.tag.create({
    data: { workspaceId, name, slug, color },
  });
}

export async function findOrCreateTag(
  workspaceId: string,
  name: string,
  slug: string,
) {
  const existing = await db.tag.findUnique({
    where: { workspaceId_slug: { workspaceId, slug } },
  });
  if (existing) return existing;
  return createTag(workspaceId, name, slug);
}
