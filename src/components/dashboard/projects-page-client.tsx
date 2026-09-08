"use client";

import { ResourceListPage } from "@/components/dashboard/resource-list-page";
import {
  createProjectAction,
  deleteProjectAction,
  listProjectsAction,
} from "@/features/projects/project.actions";

export function ProjectsPageClient({ workspaceId }: { workspaceId: string }) {
  return (
    <ResourceListPage
      workspaceId={workspaceId}
      title="Projects"
      description="Group things related to something you're working on."
      createLabel="New project"
      emptyTitle="No projects yet"
      emptyActionLabel="Create project"
      namePlaceholder="e.g. Side project, Work notes"
      descriptionPlaceholder="What is this project about?"
      dialogTitle="Create project"
      submitLabel="Create project"
      nameFieldId="project-name"
      descriptionFieldId="project-description"
      loadErrorTitle="Could not load projects"
      loadErrorMessage="Could not load projects"
      createdToast="Project created"
      deletedToast="Project deleted"
      itemHref={(id) => `/dashboard/projects/${id}`}
      listAction={listProjectsAction}
      createAction={createProjectAction}
      deleteAction={deleteProjectAction}
    />
  );
}
