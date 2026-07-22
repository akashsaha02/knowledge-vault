"use client";

import { App, Button, Card, Col, Input, Modal, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import { createTagAction, listTagsAction } from "@/features/tags/tag.actions";

type TagRecord = Awaited<ReturnType<typeof listTagsAction>>[number];

export function TagsPageClient({ workspaceId }: { workspaceId: string }) {
  const { message } = App.useApp();
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listTagsAction(workspaceId).then((data) => {
      setTags(data);
      setLoading(false);
    });
  }, [workspaceId]);

  return (
    <PageShell
      title="Tags"
      description="Label and filter items across your vault."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New tag
        </Button>
      }
    >
      {loading ? (
        <PageSkeleton />
      ) : tags.length === 0 ? (
        <EmptyState
          title="No tags yet"
          description="Tags help you filter and find related content quickly."
          primaryAction={{
            label: "Create tag",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {tags.map((tag) => (
            <Col key={tag.id} xs={24} sm={12} md={8} lg={6}>
              <Card className="!border-[var(--border)]" title={tag.name}>
                <p className="text-xs text-[var(--muted)]">{tag.slug}</p>
                <p className="text-xs text-[var(--muted)]">
                  {tag._count.items} item{tag._count.items === 1 ? "" : "s"}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Create tag"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Input.Search
          placeholder="Tag name"
          enterButton="Create"
          onSearch={async (name) => {
            if (!name.trim()) return;
            const tag = await createTagAction(workspaceId, name.trim());
            setTags((prev) => [...prev, { ...tag, _count: { items: 0 } }]);
            setOpen(false);
            message.success("Tag created");
          }}
        />
      </Modal>
    </PageShell>
  );
}
