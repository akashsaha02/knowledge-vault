"use client";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  confirmUploadAction,
  getDownloadUrlAction,
  getUploadUrlAction,
  listAttachmentsAction,
} from "@/features/attachments/attachment.actions";

type Attachment = Awaited<ReturnType<typeof listAttachmentsAction>>[number];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentUploader({
  workspaceId,
  itemId,
  variant = "default",
}: {
  workspaceId: string;
  itemId: string;
  variant?: "default" | "dropzone";
}) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listAttachmentsAction(workspaceId, itemId).then(setAttachments);
  }, [workspaceId, itemId]);

  async function handleUpload(file: File) {
    try {
      const { uploadUrl, storageKey } = await getUploadUrlAction(
        workspaceId,
        itemId,
        file.name,
        file.type,
        file.size,
      );
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      const attachment = await confirmUploadAction(
        workspaceId,
        itemId,
        storageKey,
        file.name,
        file.type,
        file.size,
      );
      setAttachments((prev) => [attachment, ...prev]);
      toast.success("File uploaded");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(
        msg.includes("SUPABASE_SERVICE_ROLE_KEY")
          ? "File uploads are not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env and restart the dev server."
          : msg,
      );
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  }

  const list =
    attachments.length > 0 ? (
      <ul className="attachment-list">
        {attachments.map((item) => (
          <li key={item.id} className="attachment-list-item">
            <span className="attachment-list-name">
              {item.originalName}{" "}
              <span className="attachment-list-size">
                {item.mimeType ? `${item.mimeType} · ` : ""}
                {formatSize(item.sizeBytes)}
              </span>
            </span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={async () => {
                const { url } = await getDownloadUrlAction(
                  workspaceId,
                  item.id,
                );
                window.open(url, "_blank");
              }}
            >
              Open
            </Button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div className={variant === "dropzone" ? "" : "mt-4"}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = "";
        }}
      />
      {variant === "dropzone" ? (
        <button
          type="button"
          className={`file-dropzone${dragging ? " file-dropzone--active" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Upload className="h-6 w-4 text-[var(--primary)]" />
          <p className="file-dropzone-title">Upload a file</p>
          <p className="file-dropzone-hint">Drop a file here, or click to browse.</p>
        </button>
      ) : (
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" />
          Upload file
        </Button>
      )}
      {list}
    </div>
  );
}
