import { Card, Typography } from "antd";
import { getShareLinkByToken } from "@/features/sharing/share.service";
import { notFound } from "next/navigation";

const { Title, Paragraph } = Typography;

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await getShareLinkByToken(token);
  if (!link) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <Title level={3}>Shared content</Title>
        <Paragraph>
          This is a view-only share link for workspace content.
        </Paragraph>
        <Paragraph type="secondary" className="text-xs">
          Token: {token.slice(0, 8)}...
        </Paragraph>
      </Card>
    </div>
  );
}
