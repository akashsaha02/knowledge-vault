import { db } from "@/lib/db";
import { itemVisibilityWhere } from "@/features/items/item-access";
import type { ItemListFilters } from "@/features/items/item.types";
import { Prisma } from "@/generated/prisma/client";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";

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

function buildAccessAndQueryFilter(
  filters: ItemListFilters,
): Prisma.ItemWhereInput {
  const queryFilter: Prisma.ItemWhereInput | undefined = filters.query
    ? {
        OR: [
          { title: { contains: filters.query, mode: "insensitive" } },
          { plainText: { contains: filters.query, mode: "insensitive" } },
        ],
      }
    : undefined;

  const accessFilter: Prisma.ItemWhereInput | undefined = filters.userId
    ? itemVisibilityWhere(
        filters.userId,
        Boolean(filters.canSeeOthersPrivateItems),
      )
    : undefined;

  const accessIsEmpty =
    accessFilter && Object.keys(accessFilter).length === 0;

  if (queryFilter && accessFilter && !accessIsEmpty) {
    return { AND: [queryFilter, accessFilter] };
  }

  return queryFilter ?? (accessIsEmpty ? {} : (accessFilter ?? {}));
}

function buildItemWhere(filters: ItemListFilters): Prisma.ItemWhereInput {
  const isTrashView = filters.status === "TRASHED";

  return {
    workspaceId: filters.workspaceId,
    ...(isTrashView
      ? { deletedAt: { not: null }, status: "TRASHED" }
      : { deletedAt: null, ...(filters.status && { status: filters.status }) }),
    ...(filters.types?.length
      ? { type: { in: filters.types } }
      : filters.type
        ? { type: filters.type }
        : {}),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.collectionId && { collectionId: filters.collectionId }),
    ...(filters.tagId && {
      tags: { some: { tagId: filters.tagId } },
    }),
    ...(filters.favoritesOnly && { isFavorite: true }),
    ...buildAccessAndQueryFilter(filters),
  };
}

export async function findItems(filters: ItemListFilters) {
  return db.item.findMany({
    where: buildItemWhere(filters),
    include: {
      tags: { include: { tag: true } },
      project: true,
      collection: true,
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    take: filters.limit ?? 50,
    skip: filters.offset ?? 0,
  });
}

export async function countItemsGroupedByType(filters: ItemListFilters) {
  return db.item.groupBy({
    by: ["type"],
    where: buildItemWhere(filters),
    _count: { _all: true },
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

export async function restoreDeletedItem(id: string, status: ItemStatus = "ACTIVE") {
  return db.item.update({
    where: { id },
    data: { deletedAt: null, status },
    include: { tags: { include: { tag: true } } },
  });
}

export async function hardDeleteItem(id: string) {
  return db.item.delete({ where: { id } });
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
  filters: {
    type?: ItemType;
    status?: ItemStatus;
    userId: string;
    canSeeOthersPrivateItems: boolean;
  },
) {
  const status = filters.status ?? "ACTIVE";
  const visibilitySql = filters.canSeeOthersPrivateItems
    ? Prisma.empty
    : Prisma.sql`AND (i.visibility <> 'PRIVATE'::"Visibility" OR i."createdById" = ${filters.userId})`;

  return db.$queryRaw<
    Array<{
      id: string;
      title: string;
      type: ItemType;
      plain_text: string;
      rank: number;
    }>
  >(
    Prisma.sql`
    SELECT i.id, i.title, i.type::text, i."plainText" as plain_text,
           ts_rank(i."searchVector", plainto_tsquery('english', ${query})) as rank
    FROM item i
    WHERE i."workspaceId" = ${workspaceId}
      AND i."deletedAt" IS NULL
      AND i.status = ${status}::"ItemStatus"
      ${
        filters.type
          ? Prisma.sql`AND i.type = ${filters.type}::"ItemType"`
          : Prisma.empty
      }
      ${visibilitySql}
      AND i."searchVector" @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC, i."updatedAt" DESC
    LIMIT 50
    `,
  );
}
