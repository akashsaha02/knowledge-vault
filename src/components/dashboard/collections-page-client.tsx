"use client";

import { App, Button, Card, Col, Form, Input, Modal, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import {
  createCollectionAction,
  deleteCollectionAction,
  listCollectionsAction,
} from "@/features/collections/collection.actions";

type Collection = Awaited<ReturnType<typeof listCollectionsAction>>[number];

export function CollectionsPageClient({ workspaceId }: { workspaceId: string }) {
  const { message } = App.useApp();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listCollectionsAction(workspaceId).then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }, [workspaceId]);

  return (
    <PageShell
      title="Collections"
      description="Curate groups of items across types — reading lists, reference sets, and more."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New collection
        </Button>
      }
    >
      {loading ? (
        <PageSkeleton />
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Curate groups of items across types — reading lists, reference sets, and more."
          primaryAction={{
            label: "Create collection",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
      <Row gutter={[16, 16]}>
        {collections.map((collection) => (
          <Col key={collection.id} xs={24} sm={12} xl={8} xxl={6}>
            <Card
              className="h-full !border-[var(--border)]"
              title={collection.name}
              extra={
                <Button
                  danger
                  size="small"
                  type="text"
                  onClick={async () => {
                    await deleteCollectionAction(workspaceId, collection.id);
                    message.success("Collection deleted");
                    setCollections((prev) =>
                      prev.filter((c) => c.id !== collection.id),
                    );
                  }}
                >
                  Delete
                </Button>
              }
            >
              <p className="text-[var(--muted)] mb-3 min-h-[40px]">
                {collection.description || "No description"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {collection._count.items} item{collection._count.items === 1 ? "" : "s"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
      )}

      <Modal
        title="Create collection"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            const collection = await createCollectionAction(
              workspaceId,
              values.name,
              values.description,
            );
            setCollections((prev) => [
              ...prev,
              { ...collection, _count: { items: 0 } },
            ]);
            setOpen(false);
            message.success("Collection created");
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Reading list, Dev resources" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="What belongs in this collection?" rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create collection
          </Button>
        </Form>
      </Modal>
    </PageShell>
  );
}
