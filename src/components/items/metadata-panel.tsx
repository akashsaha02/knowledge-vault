"use client";

import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Select, Space } from "antd";
import { useEffect, useState } from "react";
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

export function MetadataPanel({
  workspaceId,
  projectId,
  collectionId,
  tagIds,
  onUpdate,
}: MetadataPanelProps) {
  const { message } = App.useApp();
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    void listProjectsAction(workspaceId).then(setProjects);
    void listCollectionsAction(workspaceId).then(setCollections);
    void listTagsAction(workspaceId).then(setTags);
  }, [workspaceId]);

  return (
    <aside className="metadata-panel" aria-label="Item metadata">
      <p className="item-section-label">Organization</p>
      <Space orientation="vertical" className="w-full" size="middle">
        <div>
          <label className="metadata-label" htmlFor="meta-project">
            Project
          </label>
          <Select
            id="meta-project"
            allowClear
            placeholder="No project"
            className="w-full"
            value={projectId ?? undefined}
            onChange={(value) => void onUpdate({ projectId: value ?? null })}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />
        </div>
        <div>
          <label className="metadata-label" htmlFor="meta-collection">
            Collection
          </label>
          <Select
            id="meta-collection"
            allowClear
            placeholder="No collection"
            className="w-full"
            value={collectionId ?? undefined}
            onChange={(value) => void onUpdate({ collectionId: value ?? null })}
            options={collections.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <div>
          <label className="metadata-label" htmlFor="meta-tags">
            Tags
          </label>
          <Select
            id="meta-tags"
            mode="multiple"
            allowClear
            placeholder="Add tags"
            className="w-full"
            value={tagIds}
            onChange={(value) => {
              void onUpdate({ tagIds: value });
              if (value.length > 0) completeChecklistTask("tag");
            }}
            options={tags.map((t) => ({ value: t.id, label: t.name }))}
          />
          <Space.Compact className="w-full mt-2">
            <input
              className="metadata-tag-input"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name"
              aria-label="New tag name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTag.trim()) {
                  e.preventDefault();
                  void createTagAction(workspaceId, newTag.trim()).then((tag) => {
                    setTags((prev) => [...prev, tag]);
                    void onUpdate({ tagIds: [...tagIds, tag.id] });
                    completeChecklistTask("tag");
                    setNewTag("");
                    message.success("Tag created");
                  });
                }
              }}
            />
            <Button
              icon={<PlusOutlined />}
              aria-label="Create tag"
              onClick={() => {
                if (!newTag.trim()) return;
                void createTagAction(workspaceId, newTag.trim()).then((tag) => {
                  setTags((prev) => [...prev, tag]);
                  void onUpdate({ tagIds: [...tagIds, tag.id] });
                  completeChecklistTask("tag");
                  setNewTag("");
                  message.success("Tag created");
                });
              }}
            />
          </Space.Compact>
        </div>
      </Space>
    </aside>
  );
}
