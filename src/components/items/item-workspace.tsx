"use client";

import {
  ArrowLeft,
  Grid3x3,
  History,
  List,
  Loader2,
  Paperclip,
  Plus,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  archiveItemAction,
  createItemAction,
  listItemsAction,
  permanentlyDeleteItemAction,
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
import { ContentFade } from "@/components/ui/content-fade";
import { ItemDetailSkeleton, ItemGridSkeleton, ItemListSkeleton } from "@/components/ui/loading-skeleton";
import { DetailsSidePanel } from "@/components/ui/details-side-panel";
import { FriendlyConfirmDialog } from "@/components/ui/friendly-confirm-dialog";
import type { ItemType, ItemStatus } from "@/generated/prisma/client";
import { getItemHref } from "@/lib/nav-config";
import { completeChecklistTask } from "@/lib/onboarding-storage";
import { addRecentItem } from "@/lib/recent-storage";
import { getItemChecked, getNoteColor, withItemChecked, withNoteColor } from "@/lib/item-metadata";
import { readLastNoteColor, saveLastNoteColor, type NoteColorId } from "@/lib/note-colors";
import { NoteColorPicker } from "@/components/items/note-color-picker";
import { WorkspaceSplitLayout } from "@/components/items/workspace-split-layout";
import { useUiStore } from "@/stores/ui-store";

const PAGE_SIZE = 50;
const SPLIT_ITEM_TYPES = ["NOTE", "SNIPPET", "COMMAND", "PROMPT"] as const satisfies readonly ItemType[];

type ItemRecord = Awaited<ReturnType<typeof listItemsAction>>[number];

type ItemWorkspaceProps = {
  workspaceId: string;
  type?: ItemType;
  types?: ItemType[];
  status?: ItemStatus;
  title: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
  projectId?: string;
  collectionId?: string;
  initialItems?: ItemRecord[];
};

export function ItemWorkspace({
  workspaceId,
  type,
  types,
  status = "ACTIVE",
  title,
  emptyDescription,
  favoritesOnly,
  projectId,
  collectionId,
  initialItems,
}: ItemWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");
  const isDetailView = Boolean(itemId);
  const codeTab = searchParams.get("tab") === "commands" ? "commands" : "snippets";
  const activeType: ItemType | undefined =
    type ??
    (types?.length
      ? codeTab === "commands"
        ? "COMMAND"
        : "SNIPPET"
      : undefined);

  const [items, setItems] = useState<ItemRecord[]>(initialItems ?? []);
  const [selected, setSelected] = useState<ItemRecord | null>(null);
  const [loading, setLoading] = useState(!initialItems);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialItems ? initialItems.length >= PAGE_SIZE : true,
  );
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [cardDeleteTarget, setCardDeleteTarget] = useState<ItemRecord | null>(null);
  const setSelectedItemId = useUiStore((s) => s.setSelectedItemId);
  const setSelectedItemTitle = useUiStore((s) => s.setSelectedItemTitle);
  const [isMobile, setIsMobile] = useState(false);
  const [createNoteColor, setCreateNoteColor] = useState<NoteColorId>("cream");
  const isNotesPage = type === "NOTE";

  useEffect(() => {
    setCreateNoteColor(readLastNoteColor());
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const loadItems = useCallback(
    async (append = false, currentLength = 0) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const data = await listItemsAction({
          workspaceId,
          type,
          types,
          status,
          favoritesOnly,
          projectId,
          collectionId,
          limit: PAGE_SIZE,
          offset: append ? currentLength : 0,
        });

        setHasMore(data.length >= PAGE_SIZE);
        setItems((prev) => (append ? [...prev, ...data] : data));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [workspaceId, type, types, status, favoritesOnly, projectId, collectionId],
  );

  useEffect(() => {
    if (!initialItems) {
      void loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, type, types, status, favoritesOnly, projectId, collectionId]);

  useEffect(() => {
    if (!itemId) {
      setSelected(null);
      setSelectedItemId(null);
      setSelectedItemTitle(null);
      return;
    }

    const found = items.find((item) => item.id === itemId);
    if (found) {
      setSelected((prev) => {
        if (!prev || prev.id !== found.id) return found;
        return {
          ...found,
          content: prev.content,
          plainText: prev.plainText,
        };
      });
      setSelectedItemId(found.id);
      setSelectedItemTitle(found.title || "Untitled");
    }
  }, [itemId, items, setSelectedItemId, setSelectedItemTitle]);

  useEffect(() => {
    if (searchParams.get("new") && activeType) {
      void handleCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeType]);

  const filteredItems = useMemo(() => {
    const query = filter.trim().toLowerCase();
    let list = items;
    if (types?.length) {
      const targetType = codeTab === "commands" ? "COMMAND" : "SNIPPET";
      list = list.filter((item) => item.type === targetType);
    }
    if (!query) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.plainText?.toLowerCase().includes(query) ?? false),
    );
  }, [items, filter, types, codeTab]);

  const pinnedItems = filteredItems.filter((item) => item.isPinned);
  const otherItems = filteredItems.filter((item) => !item.isPinned);
  const canCreate =
    (Boolean(activeType) || status === "DRAFT") &&
    status !== "TRASHED" &&
    status !== "ARCHIVED" &&
    !favoritesOnly;
  const splitLayout =
    status === "ACTIVE" &&
    !favoritesOnly &&
    !isMobile &&
    (Boolean(type && SPLIT_ITEM_TYPES.includes(type as (typeof SPLIT_ITEM_TYPES)[number])) ||
      Boolean(types?.length));

  const itemLabel = type === "NOTE"
    ? "note"
    : type === "PROMPT"
      ? "prompt"
      : types?.length
        ? codeTab === "commands"
          ? "command"
          : "snippet"
        : title.replace(/s$/, "").toLowerCase();

  function getCreateLabel() {
    if (type === "NOTE") return "New note";
    if (type === "PROMPT") return "New prompt";
    if (types?.length) return codeTab === "commands" ? "New command" : "New snippet";
    return `New ${itemLabel}`;
  }

  function openItem(item: ItemRecord) {
    const href = getItemHref(item.type, item.id);
    addRecentItem({
      id: item.id,
      title: item.title,
      type: item.type,
      href,
    });
    router.push(href);
  }

  function closeDetail() {
    router.push(pathname);
  }

  async function handleCreate() {
    const createType = activeType ?? "NOTE";
    const defaultTitle =
      createType === "SNIPPET"
        ? "Untitled code"
        : createType === "COMMAND"
          ? "Untitled command"
          : createType === "BOOKMARK"
            ? "Untitled link"
            : createType === "PROMPT"
              ? "Untitled prompt"
              : "Untitled note";

    const item = await createItemAction({
      workspaceId,
      type: createType,
      title: defaultTitle,
      plainText: "",
      ...(status === "DRAFT" ? { status: "DRAFT" as const } : {}),
      metadata:
        createType === "SNIPPET"
          ? { language: "typescript", code: "" }
          : createType === "COMMAND"
            ? { shell: "bash", command: "" }
            : createType === "BOOKMARK"
              ? { url: "" }
              : createType === "PROMPT"
                ? { template: "" }
                : createType === "NOTE"
                  ? withNoteColor({}, createNoteColor)
                  : undefined,
    });

    if (createType === "NOTE") completeChecklistTask("note");
    if (createType === "SNIPPET") completeChecklistTask("snippet");
    if (createType === "BOOKMARK") completeChecklistTask("bookmark");

    setItems((prev) => [item as ItemRecord, ...prev]);
    router.replace(getItemHref(item.type as ItemType, item.id));
  }

  async function handleSave(json: unknown, plainText: string) {
    if (!selected) return;
    const updated = await updateItemAction({
      id: selected.id,
      workspaceId,
      content: json,
      plainText,
    });
    const record = updated as ItemRecord;
    setItems((prev) => prev.map((i) => (i.id === record.id ? record : i)));
    setSelected((prev) => {
      if (!prev || prev.id !== record.id) return prev;
      return { ...prev, updatedAt: record.updatedAt };
    });
  }

  function syncItem(updated: ItemRecord, options?: { preserveEditor?: boolean }) {
    setSelected((prev) => {
      if (!prev || prev.id !== updated.id) return prev;
      if (!options?.preserveEditor) return updated;
      return {
        ...updated,
        content: prev.content,
        plainText: prev.plainText,
      };
    });
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handlePermanentDelete(item: ItemRecord) {
    await permanentlyDeleteItemAction(workspaceId, item.id);
    toast.success("Permanently deleted");
    if (selected?.id === item.id) {
      closeDetail();
    }
    void loadItems();
  }

  async function handleCardPin(item: ItemRecord) {
    const updated = await updateItemAction({
      id: item.id,
      workspaceId,
      isPinned: !item.isPinned,
    });
    syncItem(updated as ItemRecord, { preserveEditor: true });
    toast.success(item.isPinned ? "Unpinned" : "Pinned");
  }

  async function handleCardFavorite(item: ItemRecord) {
    const updated = await updateItemAction({
      id: item.id,
      workspaceId,
      isFavorite: !item.isFavorite,
    });
    syncItem(updated as ItemRecord, { preserveEditor: true });
    toast.success(item.isFavorite ? "Removed from bookmarks" : "Bookmarked");
  }

  async function handleCardArchive(item: ItemRecord) {
    await archiveItemAction(workspaceId, item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (itemId === item.id) closeDetail();
    toast.success("Archived");
  }

  async function handleCardRestore(item: ItemRecord) {
    await restoreItemAction(workspaceId, item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (itemId === item.id) closeDetail();
    toast.success("Restored");
  }

  async function handleCardDelete(item: ItemRecord) {
    await trashItemAction(workspaceId, item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (itemId === item.id) closeDetail();
    toast.success("Moved to Trash");
    setCardDeleteTarget(null);
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
    const preserveEditor = fields.content === undefined && fields.plainText === undefined;
    syncItem(updated as ItemRecord, { preserveEditor });
  }

  async function handleCardCheck(item: ItemRecord, checked: boolean) {
    const updated = await updateItemAction({
      id: item.id,
      workspaceId,
      metadata: withItemChecked(item.metadata, checked),
    });
    syncItem(updated as ItemRecord, { preserveEditor: true });
  }

  function renderCard(item: ItemRecord) {
    const isChecked = getItemChecked(item.metadata);
    return (
      <ItemListCard
        key={item.id}
        title={item.title}
        preview={item.plainText}
        type={item.type}
        updatedAt={item.updatedAt}
        isPinned={item.isPinned}
        isFavorite={item.isFavorite}
        isChecked={isChecked}
        isActive={itemId === item.id}
        variant={splitLayout ? "sidebar" : "card"}
        noteColorId={item.type === "NOTE" ? getNoteColor(item.metadata) : undefined}
        onClick={() => openItem(item)}
        onCheckChange={
          status === "TRASHED"
            ? undefined
            : (checked) => void handleCardCheck(item, checked)
        }
        onPin={status === "ACTIVE" ? () => void handleCardPin(item) : undefined}
        onFavorite={() => void handleCardFavorite(item)}
        onArchive={status === "ACTIVE" ? () => void handleCardArchive(item) : undefined}
        onRestore={status === "TRASHED" ? () => void handleCardRestore(item) : undefined}
        onDelete={
          status !== "TRASHED" ? () => setCardDeleteTarget(item) : undefined
        }
        onPermanentDelete={
          status === "TRASHED"
            ? () => void handlePermanentDelete(item)
            : undefined
        }
      />
    );
  }

  const tagIds =
    selected?.tags?.map((entry: { tag: { id: string } }) => entry.tag.id) ?? [];

  function handleCreateNoteColorChange(colorId: NoteColorId) {
    setCreateNoteColor(colorId);
    saveLastNoteColor(colorId);
  }

  function renderCreateNoteColorPicker(compact = false) {
    if (!isNotesPage || !canCreate) return null;
    if (compact) {
      return (
        <details className="workspace-sidebar-extras">
          <summary className="workspace-sidebar-extras-summary">Default color</summary>
          <NoteColorPicker value={createNoteColor} onChange={handleCreateNoteColorChange} />
        </details>
      );
    }
    return (
      <div className="note-color-row create-note-color-row">
        <span className="note-color-label">New note color</span>
        <NoteColorPicker value={createNoteColor} onChange={handleCreateNoteColorChange} />
      </div>
    );
  }

  function renderListSidebar() {
    return (
      <aside className="item-workspace-list" aria-label={`${title} list`}>
        <div className="item-workspace-list-header">
          {types?.length ? (
            <div className="view-toggle code-page-tabs" role="tablist" aria-label="Code type">
              <button
                type="button"
                role="tab"
                aria-selected={codeTab === "snippets"}
                className={`view-toggle-btn${codeTab === "snippets" ? " view-toggle-btn--active" : ""}`}
                onClick={() => setCodeTab("snippets")}
              >
                Snippets
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={codeTab === "commands"}
                className={`view-toggle-btn${codeTab === "commands" ? " view-toggle-btn--active" : ""}`}
                onClick={() => setCodeTab("commands")}
              >
                Commands
              </button>
            </div>
          ) : null}
          <div className="workspace-list-toolbar">
            {canCreate ? (
              <Button onClick={() => void handleCreate()} size="sm" className="workspace-new-btn">
                <Plus className="h-4 w-4" />
                {getCreateLabel()}
              </Button>
            ) : null}
            <div className="relative workspace-list-search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label={`Search ${title.toLowerCase()}`}
                className="pl-9 h-9"
              />
            </div>
          </div>
          {renderCreateNoteColorPicker(true)}
        </div>
        <div className="item-workspace-list-scroll">
          {loading ? (
            <ItemListSkeleton rows={8} />
          ) : filteredItems.length === 0 ? (
            <div className="item-workspace-list-empty">
              <p>{emptyDescription}</p>
              {canCreate ? (
                <Button variant="link" onClick={() => void handleCreate()}>
                  Create your first {itemLabel}
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="item-workspace-list-view item-workspace-sidebar-rows">
              {pinnedItems.length > 0 ? (
                <section className="item-list-section">
                  <p className="item-list-section-label">Pinned</p>
                  {pinnedItems.map(renderCard)}
                </section>
              ) : null}
              {otherItems.length > 0 ? (
                <section className="item-list-section">
                  {pinnedItems.length > 0 ? (
                    <p className="item-list-section-label">All {title.toLowerCase()}</p>
                  ) : null}
                  {otherItems.map(renderCard)}
                </section>
              ) : null}
              {hasMore && !filter ? (
                <Button
                  variant="outline"
                  className="w-full item-workspace-list-load-more"
                  disabled={loadingMore}
                  onClick={() => void loadItems(true, items.length)}
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Load more
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </aside>
    );
  }

  function renderItemEditor(showBack: boolean) {
    if (itemId && loading && !selected) {
      return <ItemDetailSkeleton />;
    }

    if (itemId && !loading && !selected) {
      return (
        <div className="item-workspace-empty workspace-empty-pane">
          <EmptyState
            className="workspace-empty-state"
            title="Could not find this item"
            description="It may have been deleted or moved."
            primaryAction={{
              label: `Back to ${title.toLowerCase()}`,
              onClick: closeDetail,
            }}
          />
        </div>
      );
    }

    if (!selected) {
      return (
        <div className="item-workspace-empty workspace-empty-pane">
          <EmptyState
            className="workspace-empty-state"
            title={`Select a ${itemLabel}`}
            description={`Choose a ${itemLabel} from the sidebar or start a new one.`}
            primaryAction={
              canCreate
                ? {
                    label: getCreateLabel(),
                    onClick: () => void handleCreate(),
                  }
                : undefined
            }
          />
        </div>
      );
    }

    const isNotionSplit = splitLayout && !showBack;

    const titleInput = (
      <Input
        value={selected.title}
        onChange={(e) => {
          const nextTitle = e.target.value;
          setSelected({ ...selected, title: nextTitle });
          setSelectedItemTitle(nextTitle || "Untitled");
        }}
        onBlur={async () => {
          await updateSelectedField({ title: selected.title });
        }}
        className={
          isNotionSplit
            ? "item-title-input item-title-input-notion"
            : "item-title-input item-title-input-split"
        }
        placeholder="Give it a title"
        aria-label="Item title"
      />
    );

    return (
      <>
        <div className="item-workspace-detail-header">
          <div className="item-detail-topbar">
            {showBack ? (
              <Button
                variant="ghost"
                onClick={closeDetail}
                className="item-detail-back"
                aria-label={`Back to ${title.toLowerCase()}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : !isNotionSplit ? (
              <span className="item-detail-back-spacer" aria-hidden="true" />
            ) : null}
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
                      toast.success("Archived");
                      closeDetail();
                      void loadItems();
                    }
                  : undefined
              }
              onRestore={
                status === "ARCHIVED" || status === "TRASHED"
                  ? async () => {
                      await restoreItemAction(workspaceId, selected.id);
                      toast.success("Restored!");
                      closeDetail();
                      void loadItems();
                    }
                  : undefined
              }
              onDelete={() =>
                status === "TRASHED"
                  ? setPermanentDeleteDialogOpen(true)
                  : setDeleteDialogOpen(true)
              }
              onPermanentDelete={
                status === "TRASHED"
                  ? () => setPermanentDeleteDialogOpen(true)
                  : undefined
              }
            />
          </div>
          {!isNotionSplit ? titleInput : null}
        </div>

        <div className="item-workspace-detail-body">
          <div className="item-workspace-detail-inner">
            {isNotionSplit ? titleInput : null}

            {selected.type === "NOTE" ? (
              <div className="note-color-row">
                <span className="note-color-label">Color</span>
                <NoteColorPicker
                  value={getNoteColor(selected.metadata)}
                  onChange={(colorId) => {
                    void updateSelectedField({
                      metadata: withNoteColor(selected.metadata, colorId),
                    });
                  }}
                />
              </div>
            ) : null}

            {selected.type === "NOTE" && (
              <NoteEditor
                itemId={selected.id}
                content={selected.content}
                plainText={selected.plainText}
                onSave={handleSave}
                placeholder="Start writing..."
                className={isNotionSplit ? "note-editor--calm" : undefined}
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
                      (selected.metadata as { language?: string })?.language ??
                      "typescript",
                  };
                  await updateSelectedField({ metadata, plainText: code });
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
                  (selected.metadata as { undoCommand?: string })?.undoCommand
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
                title="File"
                description="Upload files using the attachments section below."
              />
            )}

            {selected.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {selected.tags.map(
                  (entry: { tag: { id: string; name: string } }) => (
                    <Badge key={entry.tag.id} variant="secondary">
                      {entry.tag.name}
                    </Badge>
                  ),
                )}
              </div>
            ) : null}

            <details className="item-section-details">
              <summary className="details-panel-toggle item-section-summary">
                <History className="h-4 w-4" aria-hidden="true" />
                <span>Version history</span>
              </summary>
              <div className="details-panel-body">
                <RevisionHistory
                  workspaceId={workspaceId}
                  itemId={selected.id}
                  onRestore={async (revision) => {
                    await updateSelectedField({
                      content: revision.content,
                      plainText: revision.plainText,
                    });
                    toast.success("Restored to this version");
                  }}
                />
              </div>
            </details>

            <details className="item-section-details">
              <summary className="details-panel-toggle item-section-summary">
                <Paperclip className="h-4 w-4" aria-hidden="true" />
                <span>Files &amp; attachments</span>
              </summary>
              <div className="details-panel-body">
                <AttachmentUploader
                  workspaceId={workspaceId}
                  itemId={selected.id}
                />
              </div>
            </details>

            <DetailsSidePanel>
              <MetadataPanel
                workspaceId={workspaceId}
                projectId={selected.projectId}
                collectionId={selected.collectionId}
                tagIds={tagIds}
                onUpdate={async (fields) => {
                  await updateSelectedField(fields);
                }}
              />
            </DetailsSidePanel>
          </div>
        </div>
      </>
    );
  }

  function renderConfirmDialogs() {
    return (
      <>
        <FriendlyConfirmDialog
          open={permanentDeleteDialogOpen}
          title="Delete permanently?"
          description="This cannot be undone. The item will be removed forever."
          confirmLabel="Delete permanently"
          cancelLabel="Keep in Trash"
          danger
          onConfirm={async () => {
            if (!selected) return;
            await handlePermanentDelete(selected);
            setPermanentDeleteDialogOpen(false);
          }}
          onCancel={() => setPermanentDeleteDialogOpen(false)}
        />
        <FriendlyConfirmDialog
          open={deleteDialogOpen}
          title="Move to Trash?"
          description="You can bring it back later from the Trash section."
          confirmLabel="Move to Trash"
          cancelLabel="Keep it"
          danger
          onConfirm={async () => {
            if (!selected) return;
            await trashItemAction(workspaceId, selected.id);
            toast.success("Moved to Trash");
            setDeleteDialogOpen(false);
            closeDetail();
            void loadItems();
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
        <FriendlyConfirmDialog
          open={Boolean(cardDeleteTarget)}
          title="Move to Trash?"
          description={
            cardDeleteTarget
              ? `"${cardDeleteTarget.title}" will be moved to Trash. You can restore it later.`
              : ""
          }
          confirmLabel="Move to Trash"
          cancelLabel="Keep it"
          danger
          onConfirm={async () => {
            if (cardDeleteTarget) await handleCardDelete(cardDeleteTarget);
          }}
          onCancel={() => setCardDeleteTarget(null)}
        />
      </>
    );
  }

  if (splitLayout) {
    return (
      <WorkspaceSplitLayout
        sidebar={renderListSidebar()}
        detail={renderItemEditor(false)}
        footer={renderConfirmDialogs()}
      />
    );
  }

  if (isDetailView) {
    return (
      <div className="item-detail-page item-detail-page--editor">
        {renderItemEditor(true)}
        {renderConfirmDialogs()}
      </div>
    );
  }

  function setCodeTab(tab: "snippets" | "commands") {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "commands") params.set("tab", "commands");
    else params.delete("tab");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="item-list-page">
      <div className="item-list-toolbar">
        {types?.length ? (
          <div className="view-toggle code-page-tabs" role="tablist" aria-label="Code type">
            <button
              type="button"
              role="tab"
              aria-selected={codeTab === "snippets"}
              className={`view-toggle-btn${codeTab === "snippets" ? " view-toggle-btn--active" : ""}`}
              onClick={() => setCodeTab("snippets")}
            >
              Snippets
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={codeTab === "commands"}
              className={`view-toggle-btn${codeTab === "commands" ? " view-toggle-btn--active" : ""}`}
              onClick={() => setCodeTab("commands")}
            >
              Commands
            </button>
          </div>
        ) : null}
        {canCreate ? (
          <Button onClick={() => void handleCreate()} className="item-new-btn">
            <Plus className="h-4 w-4" />
            New {codeTab === "commands" ? "command" : types?.length ? "snippet" : title.replace(/s$/, "").toLowerCase()}
          </Button>
        ) : null}
        {renderCreateNoteColorPicker()}

        <div className="item-list-toolbar-row">
          <div className="relative flex-1 item-list-search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label={`Search ${title.toLowerCase()}`}
              className="pl-9 h-11"
            />
          </div>
          {type === "NOTE" ? (
            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`view-toggle-btn${viewMode === "grid" ? " view-toggle-btn--active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
              >
                <Grid3x3 className="h-4 w-4 inline mr-1" />
                Cards
              </button>
              <button
                type="button"
                className={`view-toggle-btn${viewMode === "list" ? " view-toggle-btn--active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4 inline mr-1" />
                List
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {loading ? (
        viewMode === "grid" ? (
          <ItemGridSkeleton count={6} />
        ) : (
          <ItemListSkeleton rows={6} />
        )
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={
            status === "TRASHED"
              ? "Trash is empty"
              : `No ${title.toLowerCase()} yet`
          }
          description={emptyDescription}
          primaryAction={
            canCreate
              ? {
                  label: `Create ${title.replace(/s$/, "").toLowerCase()}`,
                  onClick: () => void handleCreate(),
                }
              : undefined
          }
        />
      ) : (
        <ContentFade>
          {pinnedItems.length > 0 ? (
            <section className="item-cards-section">
              <p className="item-cards-section-label">Pinned</p>
              <div
                className={
                  viewMode === "grid"
                    ? "item-workspace-cards"
                    : "item-workspace-list-view"
                }
              >
                {pinnedItems.map(renderCard)}
              </div>
            </section>
          ) : null}

          {otherItems.length > 0 ? (
            <section className="item-cards-section">
              {pinnedItems.length > 0 ? (
                <p className="item-cards-section-label">All {title.toLowerCase()}</p>
              ) : null}
              <div
                className={
                  viewMode === "grid"
                    ? "item-workspace-cards"
                    : "item-workspace-list-view"
                }
              >
                {otherItems.map(renderCard)}
              </div>
            </section>
          ) : null}

          {hasMore && !filter ? (
            <div className="item-list-load-more">
              <Button
                variant="outline"
                className="w-full"
                disabled={loadingMore}
                onClick={() => void loadItems(true, items.length)}
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Load more
              </Button>
            </div>
          ) : null}
        </ContentFade>
      )}

      {renderConfirmDialogs()}
    </div>
  );
}
