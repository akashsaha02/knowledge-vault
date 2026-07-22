import { Card, Col, Row, Statistic, Typography } from "antd";
import Link from "next/link";
import { listItemsAction } from "@/features/items/item.actions";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

const { Title, Paragraph } = Typography;

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  const items = await listItemsAction({ workspaceId, limit: 5 });

  return (
    <div className="p-6">
      <Title level={2} className="!font-[family-name:var(--font-display)]">
        Welcome back, {user.name}
      </Title>
      <Paragraph type="secondary">
        Your personal knowledge vault is ready.
      </Paragraph>

      <Row gutter={16} className="mt-6">
        <Col span={8}>
          <Card>
            <Statistic title="Recent items" value={items.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Link href="/dashboard/notes">Notes</Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Link href="/dashboard/search">Search</Link>
          </Card>
        </Col>
      </Row>

      <Card title="Recently updated" className="mt-6">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link href="/dashboard/notes">{item.title}</Link>
              <span className="text-neutral-400 text-sm ml-2">{item.type}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
