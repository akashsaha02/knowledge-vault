"use client";

import { App, Button, Card, Form, Input, List, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  createCollectionAction,
  deleteCollectionAction,
  listCollectionsAction,
} from "@/features/collections/collection.actions";

const { Title } = Typography;

type Collection = Awaited<ReturnType<typeof listCollectionsAction>>[number];

export function CollectionsPageClient({ workspaceId }: { workspaceId: string }) {
  const { message } = App.useApp();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    listCollectionsAction(workspaceId).then(setCollections);
  }, [workspaceId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="!mb-0">
          Collections
        </Title>
        <Button type="primary" onClick={() => setOpen(true)}>
          New collection
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={collections}
        renderItem={(collection) => (
          <List.Item>
            <Card
              title={collection.name}
              extra={
                <Button
                  danger
                  size="small"
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
              {collection.description || "No description"}
              <p className="text-xs text-neutral-400 mt-2">
                {collection._count.items} items
              </p>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Create collection"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
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
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
