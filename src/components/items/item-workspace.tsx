"use client";

import { ArrowLeftOutlined, AppstoreOutlined, PlusOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { App, Button, Input, Segmented, Space, Tag, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  archiveItemAction,
  createItemAction,
  listItemsAction,
  restoreItemAction,
  trashItemAction,
  updateItemAction,
} from "@/features/items/item.actions";
import { NoteEditor } from "@/components/editor/note-editor";
import { SnippetEditor } from "@/components/items/snippet-editor";
import { CommandEditor } from "@/components/items/command-editor";
import { PromptEditor } from "@/components/items/prompt-editor";
import { BookmarkEditor } from "@/components/items/bookmark-editor";
import { AttachmentUploader } from "@/components/items/attachment-uploader";
import { ItemListCard } from "@/components/items/item-list-card";
import { ItemDetailToolbar } from "@/components/items/item-detail-toolbar";
import { MetadataPanel } from "@/components/items/metadata-panel";
import { RevisionHistory } from "@/components/items/revision-history";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import type { ItemType, ItemStatus } from "@/generated/prisma/client";
import { TYPE_ROUTES } from "@/lib/nav-config";
import { completeChecklistTask } from "@/lib/onboarding-storage";
import { addRecentItem } from "@/lib/recent-storage";
import { useUiStore } from "@/stores/ui-store";

const { Text } = Typography;
const PAGE_SIZE = 50;

type ItemRecord = Awaited<ReturnType<typeof listItemsAction>>[number];

type ItemWorkspaceProps = {
  workspaceId: string;
  type?: ItemType;
  status?: ItemStatus;
  title: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
  initialItems?: ItemRecord[];
};

export function ItemWorkspace({
  workspaceId,
  type,
  status = "ACTIVE",
  title,
  emptyDescription,
  favoritesOnly,
  initialItems,
}: ItemWorkspaceProps) {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ItemRecord[]>(initialItems ?? []);
  const [selected, setSelected] = useState<ItemRecord | null>(null);
  const [loading, setLoading] = useState(!initialItems);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialItems ? initialItems.length >= PAGE_SIZE : true,
  );
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const setSelectedItemId = useUiStore((s) => s.setSelectedItemId);

  const loadItems = useCallback(
    async (append = false, currentLength = 0) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const data = await listItemsAction({
          workspaceId,
          type,
          status,
          favoritesOnly,
          limit: PAGE_SIZE,
          offset: append ? currentLength : 0,
        });

        setHasMore(data.length >= PAGE_SIZE);
        setItems((prev) => {
          const pool = append ? [...prev, ...data] : data;
          if (!append) {
            const itemId = searchParams.get("item");
            const fromUrl = itemId ? pool.find((item) => item.id === itemId) : null;
            setSelected((current) => {
              if (fromUrl) return fromUrl;
              if (current && pool.some((item) => item.id === current.id)) {
                return pool.find((item) => item.id === current.id) ?? current;
              }
              return pool[0] ?? null;
            });
            if (fromUrl) setMobileDetailOpen(true);
          }
          return pool;
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [workspaceId, type, status, favoritesOnly, searchParams],
  );

  useEffect(() => {
    if (!initialItems) {
      void loadItems();
    } else {
      const itemId = searchParams.get("item");
      const fromUrl = itemId
        ? initialItems.find((item) => item.id === itemId)
        : null;
      if (fromUrl) {
        setSelected(fromUrl);
        setMobileDetailOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, type, status, favoritesOnly]);

  useEffect(() => {
    if (searchParams.get("new") && type) {
      void handleCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, type]);

  const filteredItems = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.plainText?.toLowerCase().includes(query) ?? false),
    );
  }, [items, filter]);

  const pinnedItems = filteredItems.filter((item) => item.isPinned);
  const otherItems = filteredItems.filter((item) => !item.isPinned);

  async function handleCreate() {
    const defaultTitle =
      type === "SNIPPET"
        ? "Untitled snippet"
        : type === "COMMAND"
          ? "Untitled command"
          : type === "BOOKMARK"
            ? "Untitled bookmark"
            : type === "PROMPT"
              ? "Untitled prompt"
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
              : type === "PROMPT"
                ? { template: "" }
                : undefined,
    });

    if (type === "NOTE") completeChecklistTask("note");
    if (type === "SNIPPET") completeChecklistTask("snippet");
    if (type === "BOOKMARK") completeChecklistTask("bookmark");

    setItems((prev) => [item as ItemRecord, ...prev]);
    setSelected(item as ItemRecord);
    setSelectedItemId(item.id);
    setMobileDetailOpen(true);
    router.replace(window.location.pathname);
  }

  async function handleSave(json: unknown, plainText: string) {
    if (!selected) return;
    const updated = await updateItemAction({
      id: selected.id,
      workspaceId,
      content: json,
      plainText,
    });
    syncItem(updated as ItemRecord);
  }

  function syncItem(updated: ItemRecord) {
    setSelected(updated);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function updateSelectedField(
    fields: Partial<
      Pick<ItemRecord, "title" | "isPinned" | "isFavorite" | "projectId" | "collectionId"> & {
        tagIds?: string[];
        content?: unknown;
        plainText?: string;
        metadata?: unknown;
      }
    >,
  ) {
    if (!selected) return;
    const updated = await updateItemAction({
      id: selected.id,
      workspaceId,
      ...fields,
    });
    syncItem(updated as ItemRecord);
  }

  function selectItem(item: ItemRecord) {
    setSelected(item);
    setSelectedItemId(item.id);
    setMobileDetailOpen(true);
    const route = TYPE_ROUTES[item.type] ?? "/dashboard/notes";
    addRecentItem({
      id: item.id,
      title: item.title,
      type: item.type,
      href: `${route}?item=${item.id}`,
    });
  }

  function renderCard(item: ItemRecord) {
    return (
      <ItemListCard
        key={item.id}
        title={item.title}
        preview={item.plainText}
        type={item.type}
        updatedAt={item.updatedAt}
        isPinned={item.isPinned}
        isFavorite={item.isFavorite}
        selected={selected?.id === item.id}
        onClick={() => selectItem(item)}
      />
    );
  }

  const tagIds =
    selected?.tags?.map((entry: { tag: { id: string } }) => entry.tag.id) ?? [];

  return (
    <div
      className={`item-workspace ${mobileDetailOpen ? "item-workspace-mobile-detail" : ""}`}
    >
      <aside className="item-workspace-list">
        <div className="item-workspace-list-header">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => void handleCreate()}
            block
            className="item-new-btn"
          >
            New {title.replace(/s$/, "").toLowerCase()}
          </Button>
          <Input
            allowClear
            prefix={<SearchOutlined className="text-[var(--muted)]" />}
            placeholder={`Search ${title.toLowerCase()}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label={`Filter ${title.toLowerCase()}`}
          />
          {type === "NOTE" ? (
            <Segmented
              size="small"
              value={viewMode}
              onChange={(value) => setViewMode(value as "list" | "grid")}
              options={[
                { value: "list", icon: <UnorderedListOutlined /> },
                { value: "grid", icon: <AppstoreOutlined /> },
              ]}
              block
            />
          ) : null}
        </div>

        <div
          className={`item-workspace-list-scroll ${viewMode === "grid" ? "item-workspace-list-grid" : ""}`}
        >
          {loading ? (
            <ListSkeleton rows={6} className="p-4" />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              className="py-8"
              title={`No ${title.toLowerCase()} yet`}
              description={emptyDescription}
              primaryAction={{
                label: `Create ${title.replace(/s$/, "").toLowerCase()}`,
                onClick: () => void handleCreate(),
              }}
            />
          ) : (
            <>
              {pinnedItems.length > 0 ? (
                <div className="item-list-section">
                  <p className="item-list-section-label">Pinned</p>
                  {pinnedItems.map(renderCard)}
                </div>
              ) : null}
              {otherItems.length > 0 ? (
                <div className="item-list-section">
                  {pinnedItems.length > 0 ? (
                    <p className="item-list-section-label">Others</p>
                  ) : null}
                  {otherItems.map(renderCard)}
                </div>
              ) : null}
              {hasMore && !filter ? (
                <div className="p-4">
                  <Button
                    block
                    loading={loadingMore}
                    onClick={() => void loadItems(true, items.length)}
                  >
                    Load more
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </aside>

      <section className="item-workspace-detail">
        {!selected ? (
          <div className="item-workspace-empty">
            <EmptyState
              title="Nothing selected"
              description="Select an item from the list or create something new."
              primaryAction={{
                label: `Create ${title.replace(/s$/, "").toLowerCase()}`,
                onClick: () => void handleCreate(),
              }}
            />
          </div>
        ) : (
          <>
            <div className="item-workspace-detail-header">
              <Button
                type="text"
                className="item-mobile-back"
                icon={<ArrowLeftOutlined />}
                aria-label="Back to list"
                onClick={() => setMobileDetailOpen(false)}
              />
              <Input
                value={selected.title}
                onChange={(e) =>
                  setSelected({ ...selected, title: e.target.value })
                }
                onBlur={async () => {
                  await updateSelectedField({ title: selected.title });
                }}
                className="item-title-input"
                variant="borderless"
                placeholder="Untitled"
                aria-label="Item title"
              />
              <ItemDetailToolbar
                updatedAt={selected.updatedAt}
                isPinned={selected.isPinned}
                isFavorite={selected.isFavorite}
                status={selected.status}
                onTogglePin={() =>
                  void updateSelectedField({ isPinned: !selected.isPinned })
                }
                onToggleFavorite={() =>
                  void updateSelectedField({ isFavorite: !selected.isFavorite })
                }
                onArchive={
                  status === "ACTIVE"
                    ? async () => {
                        await archiveItemAction(workspaceId, selected.id);
                        message.success("Archived");
                        void loadItems();
                      }
                    : undefined
                }
                onRestore={
                  status === "ARCHIVED"
                    ? async () => {
                        await restoreItemAction(workspaceId, selected.id);
                        message.success("Restored");
                        void loadItems();
                      }
                    : undefined
                }
                onDelete={() => {
                  modal.confirm({
                    title: "Move to trash?",
                    content: "You can restore this item from Trash later.",
                    okText: "Move to trash",
                    okButtonProps: { danger: true },
                    onOk: async () => {
                      await trashItemAction(workspaceId, selected.id);
                      message.success("Moved to trash");
                      setSelected(null);
                      setMobileDetailOpen(false);
                      void loadItems();
                    },
                  });
                }}
              />
            </div>

            <div className="item-workspace-detail-body">
              <div className="item-workspace-layout">
                <div className="item-workspace-detail-inner">
                  {selected.type === "NOTE" && (
                    <NoteEditor
                      content={selected.content}
                      plainText={selected.plainText}
                      onSave={handleSave}
                      placeholder="Start writing..."
                    />
                  )}

                  {selected.type === "SNIPPET" && (
                    <SnippetEditor
                      code={
                        (selected.metadata as { code?: string })?.code ??
                        selected.plainText ??
                        ""
                      }
                      language={
                        (selected.metadata as { language?: string })?.language ??
                        "typescript"
                      }
                      onCodeChange={async (code) => {
                        const metadata = {
                          ...(selected.metadata as object),
                          code,
                          language:
                            (selected.metadata as { language?: string })
                              ?.language ?? "typescript",
                        };
                        await updateSelectedField({
                          metadata,
                          plainText: code,
                        });
                        completeChecklistTask("snippet");
                      }}
                      onLanguageChange={async (language) => {
                        const metadata = {
                          ...(selected.metadata as object),
                          language,
                        };
                        await updateSelectedField({ metadata });
                      }}
                    />
                  )}

                  {selected.type === "COMMAND" && (
                    <CommandEditor
                      command={
                        (selected.metadata as { command?: string })?.command ??
                        selected.plainText ??
                        ""
                      }
                      shell={(selected.metadata as { shell?: string })?.shell}
                      undoCommand={
                        (selected.metadata as { undoCommand?: string })
                          ?.undoCommand
                      }
                      onSave={async (data) => {
                        await updateSelectedField({
                          metadata: data,
                          plainText: data.command,
                        });
                      }}
                    />
                  )}

                  {selected.type === "BOOKMARK" && (
                    <BookmarkEditor
                      url={(selected.metadata as { url?: string })?.url ?? ""}
                      title={selected.title}
                      metadata={(selected.metadata as Record<string, unknown>) ?? {}}
                      onSave={async (data) => {
                        await updateSelectedField({
                          title: data.title,
                          plainText: data.plainText,
                          metadata: data.metadata,
                        });
                        completeChecklistTask("bookmark");
                      }}
                    />
                  )}

                  {selected.type === "PROMPT" && (
                    <PromptEditor
                      content={
                        (selected.metadata as { template?: string })?.template ??
                        selected.plainText ??
                        ""
                      }
                      onSave={async (template) => {
                        await updateSelectedField({
                          metadata: { template },
                          plainText: template,
                        });
                      }}
                    />
                  )}

                  {selected.type === "FILE" && (
                    <EmptyState
                      title="File attachment"
                      description="Upload files using the attachments section below."
                    />
                  )}

                  {selected.tags?.length ? (
                    <Space wrap>
                      {selected.tags.map(
                        (entry: { tag: { id: string; name: string } }) => (
                          <Tag key={entry.tag.id}>{entry.tag.name}</Tag>
                        ),
                      )}
                    </Space>
                  ) : null}

                  <RevisionHistory
                    workspaceId={workspaceId}
                    itemId={selected.id}
                    onRestore={async (revision) => {
                      await updateSelectedField({
                        content: revision.content,
                        plainText: revision.plainText,
                      });
                      message.success("Revision restored");
                    }}
                  />

                  <div className="item-attachments-section">
                    <Text className="item-section-label">Attachments</Text>
                    <AttachmentUploader
                      workspaceId={workspaceId}
                      itemId={selected.id}
                    />
                  </div>
                </div>

                <MetadataPanel
                  workspaceId={workspaceId}
                  projectId={selected.projectId}
                  collectionId={selected.collectionId}
                  tagIds={tagIds}
                  onUpdate={async (fields) => {
                    await updateSelectedField(fields);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
