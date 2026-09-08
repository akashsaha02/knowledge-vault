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
import type { IllustrationName } from "@/components/ui/illustration";
import { ContentFade } from "@/components/ui/content-fade";
import { PageBodySkeleton } from "@/components/ui/loading-skeleton";

export type ResourceListItem = {
  id: string;
  name: string;
  description: string | null;
  _count: { items: number };
};

type ResourceListPageProps<T extends ResourceListItem> = {
  workspaceId: string;
  title: string;
  description: string;
  createLabel: string;
  emptyTitle: string;
  emptyActionLabel: string;
  emptyIllustration?: IllustrationName;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  dialogTitle: string;
  submitLabel: string;
  nameFieldId: string;
  descriptionFieldId: string;
  loadErrorTitle: string;
  loadErrorMessage: string;
  createdToast: string;
  deletedToast: string;
  itemHref: (id: string) => string;
  listAction: (workspaceId: string) => Promise<T[]>;
  createAction: (
    workspaceId: string,
    name: string,
    description?: string,
  ) => Promise<Omit<T, "_count"> & Partial<Pick<T, "_count">>>;
  deleteAction: (workspaceId: string, id: string) => Promise<unknown>;
};

export function ResourceListPage<T extends ResourceListItem>({
  workspaceId,
  title,
  description,
  createLabel,
  emptyTitle,
  emptyActionLabel,
  emptyIllustration = "organize",
  namePlaceholder,
  descriptionPlaceholder,
  dialogTitle,
  submitLabel,
  nameFieldId,
  descriptionFieldId,
  loadErrorTitle,
  loadErrorMessage,
  createdToast,
  deletedToast,
  itemHref,
  listAction,
  createAction,
  deleteAction,
}: ResourceListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  function loadItems() {
    setLoading(true);
    setError(null);
    return listAction(workspaceId)
      .then((data) => setItems(data))
      .catch(() => setError(loadErrorMessage))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listAction(workspaceId)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError(loadErrorMessage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Server actions are stable module exports; reload only when the workspace changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  return (
    <PageShell
      title={title}
      description={description}
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {createLabel}
        </Button>
      }
    >
      {loading ? (
        <PageBodySkeleton />
      ) : error ? (
        <EmptyState
          illustration="error"
          title={loadErrorTitle}
          description={error}
          primaryAction={{
            label: "Try again",
            onClick: () => {
              void loadItems();
            },
          }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          illustration={emptyIllustration}
          title={emptyTitle}
          description={description}
          primaryAction={{
            label: emptyActionLabel,
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <ContentFade>
          <div className="key-card-grid">
            {items.map((item) => (
              <article key={item.id} className="key-card">
                <div className="key-card-header">
                  <Link href={itemHref(item.id)} className="key-card-title">
                    {item.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--destructive)] hover:text-[var(--destructive)]"
                    onClick={async (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      await deleteAction(workspaceId, item.id);
                      toast.success(deletedToast);
                      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <Link
                  href={itemHref(item.id)}
                  className="block text-inherit no-underline"
                >
                  <p className="key-card-desc">
                    {item.description || "No description"}
                  </p>
                  <p className="key-card-meta">
                    {item._count.items} item
                    {item._count.items === 1 ? "" : "s"}
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
            setItemDescription("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const created = await createAction(
                workspaceId,
                name.trim(),
                itemDescription,
              );
              setItems((prev) => [
                ...prev,
                { ...created, _count: { items: 0 } } as T,
              ]);
              setOpen(false);
              setName("");
              setItemDescription("");
              toast.success(createdToast);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor={nameFieldId}>Name</Label>
              <Input
                id={nameFieldId}
                name="name"
                placeholder={namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={descriptionFieldId}>Description</Label>
              <Textarea
                id={descriptionFieldId}
                name="description"
                placeholder={descriptionPlaceholder}
                rows={3}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {submitLabel}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
