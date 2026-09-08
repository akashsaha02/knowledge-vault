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
import { EmptyState } from "@/components/ui/empty-state";
import { ContentFade } from "@/components/ui/content-fade";
import { PageBodySkeleton } from "@/components/ui/loading-skeleton";
import { createTagAction, listTagsAction } from "@/features/tags/tag.actions";

type TagRecord = Awaited<ReturnType<typeof listTagsAction>>[number];

export function TagsPageClient({ workspaceId }: { workspaceId: string }) {
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    setLoading(true);
    listTagsAction(workspaceId).then((data) => {
      setTags(data);
      setLoading(false);
    });
  }, [workspaceId]);

  async function handleCreate(name: string) {
    if (!name.trim()) return;
    const tag = await createTagAction(workspaceId, name.trim());
    setTags((prev) => [...prev, { ...tag, _count: { items: 0 } }]);
    setOpen(false);
    setTagName("");
    toast.success("Tag created");
  }

  return (
    <PageShell
      title="Tags"
      description="Label items so you can filter them later. You can also add tags from Details on any item."
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New tag
        </Button>
      }
    >
      {loading ? (
        <PageBodySkeleton />
      ) : tags.length === 0 ? (
        <EmptyState
          illustration="organize"
          title="No tags yet"
          description="Tags help you filter and find related content quickly."
          primaryAction={{
            label: "Create tag",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <ContentFade>
          <div className="key-card-grid">
            {tags.map((tag) => (
              <article key={tag.id} className="key-card">
                <Link
                  href={`/dashboard/search?tag=${encodeURIComponent(tag.id)}`}
                  className="block text-inherit no-underline"
                >
                  <h3 className="key-card-title">{tag.name}</h3>
                  <p className="key-card-desc">{tag.slug}</p>
                  <p className="key-card-meta">
                    {tag._count.items} item{tag._count.items === 1 ? "" : "s"}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </ContentFade>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
          </DialogHeader>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void handleCreate(tagName);
            }}
          >
            <Input
              placeholder="Tag name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              aria-label="Tag name"
              autoFocus
            />
            <Button type="submit">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
