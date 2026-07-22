"use server";

import { revalidatePath } from "next/cache";
import {
  createProjectForUser,
  deleteProjectForUser,
  listProjects,
  updateProjectForUser,
} from "@/features/projects/project.service";
import { requireUser } from "@/lib/session";

export async function listProjectsAction(workspaceId: string) {
  const user = await requireUser();
  return listProjects(user.id, workspaceId);
}

export async function createProjectAction(
  workspaceId: string,
  name: string,
  description?: string,
) {
  const user = await requireUser();
  const project = await createProjectForUser(
    user.id,
    workspaceId,
    name,
    description,
  );
  revalidatePath("/dashboard/projects");
  return project;
}

export async function updateProjectAction(
  workspaceId: string,
  projectId: string,
  data: { name?: string; description?: string; color?: string },
) {
  const user = await requireUser();
  const project = await updateProjectForUser(
    user.id,
    workspaceId,
    projectId,
    data,
  );
  revalidatePath("/dashboard/projects");
  return project;
}

export async function deleteProjectAction(
  workspaceId: string,
  projectId: string,
) {
  const user = await requireUser();
  await deleteProjectForUser(user.id, workspaceId, projectId);
  revalidatePath("/dashboard/projects");
}
