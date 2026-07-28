import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export async function findCollectionById(id: string) {
  return db.collection.findUnique({
    where: { id },
    include: { _count: { select: { items: true } } },
  });
}

export async function findCollections(workspaceId: string) {
  return db.collection.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function createCollection(data: Prisma.CollectionCreateInput) {
  return db.collection.create({ data });
}

export async function updateCollection(
  id: string,
  data: Prisma.CollectionUpdateInput,
) {
  return db.collection.update({ where: { id }, data });
}

export async function deleteCollection(id: string) {
  return db.collection.delete({ where: { id } });
}
