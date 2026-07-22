import { Card, Tag } from "antd";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { notFound } from "next/navigation";
import { getPublicSharedContent } from "@/features/sharing/share.service";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const shared = await getPublicSharedContent(token);
  if (!shared) notFound();

  const { link, item } = shared;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <Card className="max-w-2xl w-full !border-[var(--border)]">
        <Title level={3}>Shared content</Title>
        {!item ? (
          <Paragraph className="text-[var(--muted)]">
            This workspace share link is active but no specific item is attached.
          </Paragraph>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Tag>{item.type}</Tag>
              {link.allowCopy ? <Tag color="blue">Copy allowed</Tag> : null}
            </div>
            <Title level={4}>{item.title}</Title>
            {item.plainText ? (
              <pre className="share-content-preview whitespace-pre-wrap font-mono text-sm bg-[var(--code-bg)] p-4 rounded-lg">
                {item.plainText}
              </pre>
            ) : (
              <Paragraph className="text-[var(--muted)]">No text content.</Paragraph>
            )}
            {item.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((entry) => (
                  <Tag key={entry.tag.id}>{entry.tag.name}</Tag>
                ))}
              </div>
            ) : null}
          </>
        )}
        <Paragraph type="secondary" className="text-xs mt-4">
          Views: {link.viewCount + 1}
        </Paragraph>
      </Card>
    </div>
  );
}
