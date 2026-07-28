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

export function AttachmentUploader({
  workspaceId,
  itemId,
}: {
  workspaceId: string;
  itemId: string;
}) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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

  return (
    <div className="mt-4">
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
      <Button onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-4 w-4" />
        Upload attachment
      </Button>

      {attachments.length > 0 ? (
        <ul className="attachment-list">
          {attachments.map((item) => (
            <li key={item.id} className="attachment-list-item">
              <span className="attachment-list-name">
                {item.originalName}{" "}
                <span className="attachment-list-size">
                  ({Math.round(item.sizeBytes / 1024)} KB)
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
                Download
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
