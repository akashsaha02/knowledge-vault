"use client";

import { History, Paperclip } from "lucide-react";
import { AttachmentUploader } from "@/components/items/attachment-uploader";
import { MetadataPanel } from "@/components/items/metadata-panel";
import { RevisionHistory } from "@/components/items/revision-history";

type ItemOrganizePanelProps = {
  workspaceId: string;
  itemId: string;
  projectId?: string | null;
  collectionId?: string | null;
  tagIds: string[];
  onUpdate: (fields: {
    projectId?: string | null;
    collectionId?: string | null;
    tagIds?: string[];
  }) => Promise<void>;
  onRestoreRevision: (revision: {
    content: unknown;
    plainText: string;
  }) => Promise<void>;
};

export function ItemOrganizePanel({
  workspaceId,
  itemId,
  projectId,
  collectionId,
  tagIds,
  onUpdate,
  onRestoreRevision,
}: ItemOrganizePanelProps) {
  return (
    <section className="item-organize-panel" aria-label="Organize">
      <MetadataPanel
        workspaceId={workspaceId}
        projectId={projectId}
        collectionId={collectionId}
        tagIds={tagIds}
        onUpdate={onUpdate}
      />

      <div className="item-organize-block">
        <p className="item-section-label">
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          Attachments
        </p>
        <AttachmentUploader workspaceId={workspaceId} itemId={itemId} />
      </div>

      <div className="item-organize-block">
        <p className="item-section-label">
          <History className="h-4 w-4" aria-hidden="true" />
          Version history
        </p>
        <RevisionHistory
          workspaceId={workspaceId}
          itemId={itemId}
          onRestore={onRestoreRevision}
        />
      </div>
    </section>
  );
}
