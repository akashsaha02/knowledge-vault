"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const selectedTagNames = tags
    .filter((tag) => tagIds.includes(tag.id))
    .map((tag) => tag.name);

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
    <aside className="metadata-panel" aria-label="Item metadata">
      <p className="item-section-label">Organization</p>
      <div className="flex w-full flex-col gap-4">
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
        </div>
        <div>
          <label className="metadata-label" htmlFor="meta-tags">
            Tags
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="meta-tags"
                variant="outline"
                className="w-full justify-between font-normal"
              >
                <span className="truncate">
                  {selectedTagNames.length > 0
                    ? selectedTagNames.join(", ")
                    : "Add tags"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {tags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={tagIds.includes(tag.id)}
                  onCheckedChange={(checked) => {
                    const nextTagIds = checked
                      ? [...tagIds, tag.id]
                      : tagIds.filter((id) => id !== tag.id);
                    void onUpdate({ tagIds: nextTagIds });
                    if (nextTagIds.length > 0) completeChecklistTask("tag");
                  }}
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 flex w-full">
            <input
              id="meta-tag-input"
              className="metadata-tag-input flex-1"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name"
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
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
