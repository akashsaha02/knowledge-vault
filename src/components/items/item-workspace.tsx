"use client";

import {
  App,
  Button,
  Empty,
  Input,
  List,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  archiveItemAction,
  createItemAction,
  listItemsAction,
  restoreItemAction,
  trashItemAction,
  updateItemAction,
} from "@/features/items/item.actions";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { SnippetViewer } from "@/components/items/snippet-viewer";
import { CommandViewer } from "@/components/items/command-viewer";
import { BookmarkViewer } from "@/components/items/bookmark-viewer";
import { AttachmentUploader } from "@/components/items/attachment-uploader";
import type { ItemType, ItemStatus } from "@/generated/prisma/client";
import { useUiStore } from "@/stores/ui-store";

const { Title, Text } = Typography;

type ItemRecord = Awaited<ReturnType<typeof listItemsAction>>[number];

type ItemWorkspaceProps = {
  workspaceId: string;
  type?: ItemType;
  status?: ItemStatus;
  title: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
};

export function ItemWorkspace({
  workspaceId,
  type,
  status = "ACTIVE",
  title,
  emptyDescription,
  favoritesOnly,
}: ItemWorkspaceProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [selected, setSelected] = useState<ItemRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const setSelectedItemId = useUiStore((s) => s.setSelectedItemId);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listItemsAction({
        workspaceId,
        type,
        status,
        favoritesOnly,
      });
      setItems(data);
      if (data[0] && !selected) setSelected(data[0]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, type, status, favoritesOnly, selected]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (searchParams.get("new") && type) {
      handleCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, type]);

  async function handleCreate() {
    const defaultTitle =
      type === "SNIPPET"
        ? "Untitled snippet"
        : type === "COMMAND"
          ? "Untitled command"
          : type === "BOOKMARK"
            ? "Untitled bookmark"
            : "Untitled note";

    const item = await createItemAction({
      workspaceId,
      type: type ?? "NOTE",
      title: defaultTitle,
      plainText: "",
      metadata:
        type === "SNIPPET"
          ? { language: "typescript", code: "" }
          : type === "COMMAND"
            ? { shell: "bash", command: "" }
            : type === "BOOKMARK"
              ? { url: "" }
              : undefined,
    });
    setItems((prev) => [item as ItemRecord, ...prev]);
    setSelected(item as ItemRecord);
    setSelectedItemId(item.id);
    router.replace(window.location.pathname);
  }

  async function handleSave(json: unknown, plainText: string) {
    if (!selected) return;
    await updateItemAction({
      id: selected.id,
      workspaceId,
      content: json,
      plainText,
    });
    setItems((prev) =>
      prev.map((i) =>
        i.id === selected.id
          ? { ...i, content: json as ItemRecord["content"], plainText }
          : i,
      ),
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-64px)]">
      <div className="w-80 border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <Space className="w-full justify-between">
            <Title level={5} className="!mb-0">
              {title}
            </Title>
            <Button size="small" type="primary" onClick={handleCreate}>
              New
            </Button>
          </Space>
        </div>
        <List
          loading={loading}
          dataSource={items}
          locale={{ emptyText: <Empty description={emptyDescription} /> }}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer px-4 ${selected?.id === item.id ? "bg-neutral-100" : ""}`}
              onClick={() => {
                setSelected(item);
                setSelectedItemId(item.id);
              }}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <Text type="secondary" className="text-xs line-clamp-1">
                    {item.plainText || "No content"}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {!selected ? (
          <Empty description="Select or create an item" />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            <Input
              value={selected.title}
              onChange={(e) =>
                setSelected({ ...selected, title: e.target.value })
              }
              onBlur={async () => {
                await updateItemAction({
                  id: selected.id,
                  workspaceId,
                  title: selected.title,
                });
                message.success("Title saved");
              }}
              className="!text-xl !font-semibold"
              variant="borderless"
            />

            {selected.type === "NOTE" && (
              <TiptapEditor
                content={selected.content}
                onSave={handleSave}
              />
            )}

            {selected.type === "SNIPPET" && (
              <SnippetViewer
                code={
                  (selected.metadata as { code?: string })?.code ??
                  selected.plainText
                }
                language={
                  (selected.metadata as { language?: string })?.language ??
                  "typescript"
                }
                onLanguageChange={async (language) => {
                  const metadata = {
                    ...(selected.metadata as object),
                    language,
                  };
                  await updateItemAction({
                    id: selected.id,
                    workspaceId,
                    metadata,
                  });
                  setSelected({ ...selected, metadata });
                }}
              />
            )}

            {selected.type === "COMMAND" && (
              <CommandViewer
                command={
                  (selected.metadata as { command?: string })?.command ??
                  selected.plainText
                }
                shell={(selected.metadata as { shell?: string })?.shell}
                undoCommand={
                  (selected.metadata as { undoCommand?: string })?.undoCommand
                }
              />
            )}

            {selected.type === "BOOKMARK" && (
              <BookmarkViewer
                url={(selected.metadata as { url: string }).url ?? ""}
                title={selected.title}
                description={
                  (selected.metadata as { description?: string }).description
                }
                siteName={
                  (selected.metadata as { siteName?: string }).siteName
                }
                faviconUrl={
                  (selected.metadata as { faviconUrl?: string }).faviconUrl
                }
                previewImageUrl={
                  (selected.metadata as { previewImageUrl?: string })
                    .previewImageUrl
                }
              />
            )}

            <Space wrap>
              {selected.tags?.map(
                (entry: { tag: { id: string; name: string } }) => (
                  <Tag key={entry.tag.id}>{entry.tag.name}</Tag>
                ),
              )}
            </Space>

            <AttachmentUploader
              workspaceId={workspaceId}
              itemId={selected.id}
            />

            <Space>
              {status === "ACTIVE" && (
                <Button
                  onClick={async () => {
                    await archiveItemAction(workspaceId, selected.id);
                    message.success("Archived");
                    loadItems();
                  }}
                >
                  Archive
                </Button>
              )}
              {status === "ARCHIVED" && (
                <Button
                  onClick={async () => {
                    await restoreItemAction(workspaceId, selected.id);
                    message.success("Restored");
                    loadItems();
                  }}
                >
                  Restore
                </Button>
              )}
              <Popconfirm
                title="Move to trash?"
                onConfirm={async () => {
                  await trashItemAction(workspaceId, selected.id);
                  message.success("Moved to trash");
                  setSelected(null);
                  loadItems();
                }}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Space>
          </div>
        )}
      </div>
    </div>
  );
}
