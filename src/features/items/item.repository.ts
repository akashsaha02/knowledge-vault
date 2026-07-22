import { db } from "@/lib/db";
import type { ItemListFilters } from "@/features/items/item.types";
import type { ItemStatus, ItemType, Prisma } from "@/generated/prisma/client";

export async function findItemById(id: string) {
  return db.item.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      project: true,
      collection: true,
      attachments: true,
    },
  });
}

export async function findItems(filters: ItemListFilters) {
  const where: Prisma.ItemWhereInput = {
    workspaceId: filters.workspaceId,
    deletedAt: null,
    ...(filters.type && { type: filters.type }),
    ...(filters.status && { status: filters.status }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.collectionId && { collectionId: filters.collectionId }),
    ...(filters.tagId && {
      tags: { some: { tagId: filters.tagId } },
    }),
    ...(filters.query && {
      OR: [
        { title: { contains: filters.query, mode: "insensitive" } },
        { plainText: { contains: filters.query, mode: "insensitive" } },
      ],
    }),
    ...(filters.favoritesOnly && { isFavorite: true }),
  };

  return db.item.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
      project: true,
      collection: true,
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    take: filters.limit ?? 50,
  });
}

export async function createItem(data: Prisma.ItemCreateInput) {
  return db.item.create({
    data,
    include: { tags: { include: { tag: true } } },
  });
}

export async function updateItem(id: string, data: Prisma.ItemUpdateInput) {
  return db.item.update({
    where: { id },
    data,
    include: { tags: { include: { tag: true } } },
  });
}

export async function softDeleteItem(id: string) {
  return db.item.update({
    where: { id },
    data: { deletedAt: new Date(), status: "TRASHED" },
  });
}

export async function createRevision(data: {
  itemId: string;
  createdById: string;
  content: Prisma.InputJsonValue;
  plainText: string;
  changeSummary?: string;
  name?: string;
}) {
  return db.revision.create({ data });
}

export async function findRevisions(itemId: string) {
  return db.revision.findMany({
    where: { itemId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function slugExists(workspaceId: string, slug: string) {
  const existing = await db.item.findUnique({
    where: { workspaceId_slug: { workspaceId, slug } },
    select: { id: true },
  });
  return Boolean(existing);
}

export async function searchItemsFullText(
  workspaceId: string,
  query: string,
  filters?: { type?: ItemType; status?: ItemStatus },
) {
  const typeFilter = filters?.type ? `AND i.type = '${filters.type}'` : "";
  const statusFilter = filters?.status
    ? `AND i.status = '${filters.status}'`
    : "AND i.status = 'ACTIVE'";

  return db.$queryRawUnsafe<
    Array<{
      id: string;
      title: string;
      type: ItemType;
      plain_text: string;
      rank: number;
    }>
  >(
    `
    SELECT i.id, i.title, i.type::text, i."plainText" as plain_text,
           ts_rank(i."searchVector", plainto_tsquery('english', $2)) as rank
    FROM item i
    WHERE i."workspaceId" = $1
      AND i."deletedAt" IS NULL
      ${statusFilter}
      ${typeFilter}
      AND i."searchVector" @@ plainto_tsquery('english', $2)
    ORDER BY rank DESC, i."updatedAt" DESC
    LIMIT 50
    `,
    workspaceId,
    query,
  );
}
