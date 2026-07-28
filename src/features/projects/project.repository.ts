import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export async function findProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
    include: { _count: { select: { items: true } } },
  });
}

export async function findProjects(workspaceId: string) {
  return db.project.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  return db.project.create({ data });
}

export async function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  return db.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return db.project.delete({ where: { id } });
}
