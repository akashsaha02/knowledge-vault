"use client";

import { HistoryOutlined } from "@ant-design/icons";
import { Button, Collapse, List } from "antd";
import { useState } from "react";
import { getRevisionsAction } from "@/features/items/item.actions";
import { formatRelativeTime } from "@/lib/format-date";

type RevisionHistoryProps = {
  workspaceId: string;
  itemId: string;
  onRestore: (revision: {
    content: unknown;
    plainText: string;
  }) => Promise<void>;
};

type Revision = Awaited<ReturnType<typeof getRevisionsAction>>[number];

export function RevisionHistory({
  workspaceId,
  itemId,
  onRestore,
}: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (revisions) return;
    setLoading(true);
    try {
      const data = await getRevisionsAction(workspaceId, itemId);
      setRevisions(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Collapse
      className="revision-history"
      items={[
        {
          key: "history",
          label: (
            <span>
              <HistoryOutlined /> Version history
            </span>
          ),
          children: (
            <div>
              {!revisions && !loading ? (
                <Button size="small" onClick={() => void load()}>
                  Load revisions
                </Button>
              ) : null}
              {loading ? <p className="text-[var(--muted)] text-sm">Loading...</p> : null}
              {revisions?.length === 0 ? (
                <p className="text-[var(--muted)] text-sm">No revisions yet.</p>
              ) : null}
              {revisions && revisions.length > 0 ? (
                <List
                  size="small"
                  dataSource={revisions}
                  renderItem={(revision) => (
                    <List.Item
                      actions={[
                        <Button
                          key="restore"
                          type="link"
                          size="small"
                          onClick={() =>
                            void onRestore({
                              content: revision.content,
                              plainText: revision.plainText,
                            })
                          }
                        >
                          Restore
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={revision.changeSummary ?? "Revision"}
                        description={formatRelativeTime(revision.createdAt)}
                      />
                    </List.Item>
                  )}
                />
              ) : null}
            </div>
          ),
        },
      ]}
    />
  );
}
