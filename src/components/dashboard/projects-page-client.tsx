"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { ContentFade } from "@/components/ui/content-fade";
import { PageBodySkeleton } from "@/components/ui/loading-skeleton";
import {
  createProjectAction,
  deleteProjectAction,
  listProjectsAction,
} from "@/features/projects/project.actions";

type Project = Awaited<ReturnType<typeof listProjectsAction>>[number];

export function ProjectsPageClient({ workspaceId }: { workspaceId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listProjectsAction(workspaceId)
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load projects");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return (
    <PageShell
      title="Projects"
      description="Group related notes, snippets, and files into focused projects."
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      }
    >
      {loading ? (
        <PageBodySkeleton />
      ) : error ? (
        <EmptyState
          title="Could not load projects"
          description={error}
          primaryAction={{
            label: "Try again",
            onClick: () => {
              setLoading(true);
              setError(null);
              listProjectsAction(workspaceId)
                .then(setProjects)
                .catch(() => setError("Could not load projects"))
                .finally(() => setLoading(false));
            },
          }}
        />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Group related notes, snippets, and files into focused projects."
          primaryAction={{
            label: "Create project",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <ContentFade>
          <div className="key-card-grid">
            {projects.map((project) => (
              <article key={project.id} className="key-card">
                <div className="key-card-header">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="key-card-title"
                  >
                    {project.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--destructive)] hover:text-[var(--destructive)]"
                    onClick={async (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      await deleteProjectAction(workspaceId, project.id);
                      toast.success("Project deleted");
                      setProjects((prev) => prev.filter((p) => p.id !== project.id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="block text-inherit no-underline"
                >
                  <p className="key-card-desc">
                    {project.description || "No description"}
                  </p>
                  <p className="key-card-meta">
                    {project._count.items} item
                    {project._count.items === 1 ? "" : "s"}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </ContentFade>
      )}

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setName("");
            setDescription("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const project = await createProjectAction(
                workspaceId,
                name.trim(),
                description,
              );
              setProjects((prev) => [...prev, { ...project, _count: { items: 0 } }]);
              setOpen(false);
              setName("");
              setDescription("");
              toast.success("Project created");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                name="name"
                placeholder="e.g. Side project, Work notes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                name="description"
                placeholder="What is this project about?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
