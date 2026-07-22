"use client";

import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Upload } from "antd";
import { useEffect, useState } from "react";
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
  const { message } = App.useApp();
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    listAttachmentsAction(workspaceId, itemId).then(setAttachments);
  }, [workspaceId, itemId]);

  return (
    <div className="mt-4">
      <Upload
        showUploadList={false}
        customRequest={async ({ file, onSuccess, onError }) => {
          try {
            const uploadFile = file as File;
            const { uploadUrl, storageKey } = await getUploadUrlAction(
              workspaceId,
              itemId,
              uploadFile.name,
              uploadFile.type,
              uploadFile.size,
            );
            await fetch(uploadUrl, {
              method: "PUT",
              body: uploadFile,
              headers: { "Content-Type": uploadFile.type },
            });
            const attachment = await confirmUploadAction(
              workspaceId,
              itemId,
              storageKey,
              uploadFile.name,
              uploadFile.type,
              uploadFile.size,
            );
            setAttachments((prev) => [attachment, ...prev]);
            onSuccess?.(attachment);
            message.success("File uploaded");
          } catch (error) {
            onError?.(error as Error);
            const msg =
              error instanceof Error ? error.message : "Upload failed";
            message.error(
              msg.includes("SUPABASE_SERVICE_ROLE_KEY")
                ? "File uploads are not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env and restart the dev server."
                : msg,
            );
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Upload attachment</Button>
      </Upload>

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
                type="link"
                size="small"
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
