"use client";

import { ExportOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import Image from "next/image";

const { Title, Paragraph, Text } = Typography;

type BookmarkViewerProps = {
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  faviconUrl?: string;
  previewImageUrl?: string;
};

export function BookmarkViewer({
  url,
  title,
  description,
  siteName,
  faviconUrl,
  previewImageUrl,
}: BookmarkViewerProps) {
  return (
    <Card className="overflow-hidden">
      {previewImageUrl && (
        <div className="relative h-40 w-full mb-4">
          <Image
            src={previewImageUrl}
            alt={title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
      )}
      <div className="flex items-start gap-3">
        {faviconUrl && (
          <Image src={faviconUrl} alt="" width={20} height={20} unoptimized />
        )}
        <div className="flex-1">
          <Title level={4} className="!mb-1">
            {title}
          </Title>
          {siteName && <Text type="secondary">{siteName}</Text>}
          {description && (
            <Paragraph className="!mt-2 !mb-0">{description}</Paragraph>
          )}
          <Button
            type="link"
            icon={<ExportOutlined />}
            href={url}
            target="_blank"
            className="!px-0 mt-2"
          >
            {url}
          </Button>
        </div>
      </div>
    </Card>
  );
}
