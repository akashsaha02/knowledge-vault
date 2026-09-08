"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listCollectionsAction } from "@/features/collections/collection.actions";
import { listProjectsAction } from "@/features/projects/project.actions";
import { createTagAction, listTagsAction } from "@/features/tags/tag.actions";
import { completeChecklistTask } from "@/lib/onboarding-storage";

type MetadataPanelProps = {
  workspaceId: string;
  projectId?: string | null;
  collectionId?: string | null;
  tagIds: string[];
  onUpdate: (fields: {
    projectId?: string | null;
    collectionId?: string | null;
    tagIds?: string[];
  }) => Promise<void>;
};

const NONE_VALUE = "__none__";

export function MetadataPanel({
  workspaceId,
  projectId,
  collectionId,
  tagIds,
  onUpdate,
}: MetadataPanelProps) {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    void listProjectsAction(workspaceId).then(setProjects);
    void listCollectionsAction(workspaceId).then(setCollections);
    void listTagsAction(workspaceId).then(setTags);
  }, [workspaceId]);

  const selectedTags = tags.filter((tag) => tagIds.includes(tag.id));

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    const tag = await createTagAction(workspaceId, newTag.trim());
    setTags((prev) => [...prev, tag]);
    void onUpdate({ tagIds: [...tagIds, tag.id] });
    completeChecklistTask("tag");
    setNewTag("");
    toast.success("Tag created");
  }

  return (
    <aside className="metadata-panel" aria-label="Item details">
      <div className="flex w-full flex-col gap-5">
        <div>
          <label className="metadata-label" htmlFor="meta-project">
            Project
          </label>
          <Select
            value={projectId ?? NONE_VALUE}
            onValueChange={(value) =>
              void onUpdate({ projectId: value === NONE_VALUE ? null : value })
            }
          >
            <SelectTrigger id="meta-project" className="w-full">
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>No project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="metadata-hint">
            Group things related to something you&apos;re working on.
          </p>
        </div>
        <div>
          <label className="metadata-label" htmlFor="meta-collection">
            Collection
          </label>
          <Select
            value={collectionId ?? NONE_VALUE}
            onValueChange={(value) =>
              void onUpdate({ collectionId: value === NONE_VALUE ? null : value })
            }
          >
            <SelectTrigger id="meta-collection" className="w-full">
              <SelectValue placeholder="No collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>No collection</SelectItem>
              {collections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="metadata-hint">
            Lightweight lists across types, like reading lists.
          </p>
        </div>
        <div>
          <p className="metadata-label" id="meta-tags-label">
            Tags
          </p>
          <div className="tag-chip-row" aria-labelledby="meta-tags-label">
            {selectedTags.map((tag) => (
              <span key={tag.id} className="tag-chip">
                {tag.name}
                <button
                  type="button"
                  className="tag-chip-remove"
                  aria-label={`Remove tag ${tag.name}`}
                  onClick={() =>
                    void onUpdate({
                      tagIds: tagIds.filter((id) => id !== tag.id),
                    })
                  }
                >
                  <X className="h-3 w-4" />
                </button>
              </span>
            ))}
          </div>
          <Select
            value={NONE_VALUE}
            onValueChange={(value) => {
              if (value === NONE_VALUE || tagIds.includes(value)) return;
              void onUpdate({ tagIds: [...tagIds, value] });
              completeChecklistTask("tag");
            }}
          >
            <SelectTrigger className="w-full mt-2" aria-label="Add existing tag">
              <SelectValue placeholder="Add a tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>Add a tag</SelectItem>
              {tags
                .filter((tag) => !tagIds.includes(tag.id))
                .map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex w-full">
            <input
              id="meta-tag-input"
              className="metadata-tag-input flex-1"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
              aria-label="New tag name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTag.trim()) {
                  e.preventDefault();
                  void handleCreateTag();
                }
              }}
            />
            <Button
              aria-label="Create tag"
              onClick={() => void handleCreateTag()}
              className="rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
