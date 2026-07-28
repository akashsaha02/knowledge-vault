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
  createCollectionAction,
  deleteCollectionAction,
  listCollectionsAction,
} from "@/features/collections/collection.actions";

type Collection = Awaited<ReturnType<typeof listCollectionsAction>>[number];

export function CollectionsPageClient({ workspaceId }: { workspaceId: string }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listCollectionsAction(workspaceId)
      .then((data) => {
        if (!cancelled) setCollections(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load collections");
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
      title="Collections"
      description="Curate groups of items across types — reading lists, reference sets, and more."
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New collection
        </Button>
      }
    >
      {loading ? (
        <PageBodySkeleton />
      ) : error ? (
        <EmptyState
          title="Could not load collections"
          description={error}
          primaryAction={{
            label: "Try again",
            onClick: () => {
              setLoading(true);
              setError(null);
              listCollectionsAction(workspaceId)
                .then(setCollections)
                .catch(() => setError("Could not load collections"))
                .finally(() => setLoading(false));
            },
          }}
        />
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Curate groups of items across types — reading lists, reference sets, and more."
          primaryAction={{
            label: "Create collection",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <ContentFade>
          <div className="key-card-grid">
            {collections.map((collection) => (
              <article key={collection.id} className="key-card">
                <div className="key-card-header">
                  <Link
                    href={`/dashboard/collections/${collection.id}`}
                    className="key-card-title"
                  >
                    {collection.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--destructive)] hover:text-[var(--destructive)]"
                    onClick={async (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      await deleteCollectionAction(workspaceId, collection.id);
                      toast.success("Collection deleted");
                      setCollections((prev) =>
                        prev.filter((c) => c.id !== collection.id),
                      );
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <Link
                  href={`/dashboard/collections/${collection.id}`}
                  className="block text-inherit no-underline"
                >
                  <p className="key-card-desc">
                    {collection.description || "No description"}
                  </p>
                  <p className="key-card-meta">
                    {collection._count.items} item
                    {collection._count.items === 1 ? "" : "s"}
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
            <DialogTitle>Create collection</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const collection = await createCollectionAction(
                workspaceId,
                name.trim(),
                description,
              );
              setCollections((prev) => [
                ...prev,
                { ...collection, _count: { items: 0 } },
              ]);
              setOpen(false);
              setName("");
              setDescription("");
              toast.success("Collection created");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                name="name"
                placeholder="e.g. Reading list, Dev resources"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                name="description"
                placeholder="What belongs in this collection?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create collection
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
