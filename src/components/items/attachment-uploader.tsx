"use client";

import { UploadOutlined } from "@ant-design/icons";
import { App, Button, List, Upload } from "antd";
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
            message.error("Upload failed");
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Upload attachment</Button>
      </Upload>
      <List
        className="mt-3"
        dataSource={attachments}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="download"
                type="link"
                onClick={async () => {
                  const { url } = await getDownloadUrlAction(
                    workspaceId,
                    item.id,
                  );
                  window.open(url, "_blank");
                }}
              >
                Download
              </Button>,
            ]}
          >
            {item.originalName} ({Math.round(item.sizeBytes / 1024)} KB)
          </List.Item>
        )}
      />
    </div>
  );
}
