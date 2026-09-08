"use client";

import {
  ArrowLeft,
  Grid3x3,
  List,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemListCard } from "@/components/items/item-list-card";
import { ItemDetailToolbar } from "@/components/items/item-detail-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import type { IllustrationName } from "@/components/ui/illustration";
import { PageHint } from "@/components/onboarding/page-hint";
import { ContentFade } from "@/components/ui/content-fade";
import { ItemDetailSkeleton, ItemGridSkeleton, ItemListSkeleton } from "@/components/ui/loading-skeleton";
import { NoteColorPicker } from "@/components/items/note-color-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WorkspaceSplitLayout } from "@/components/items/workspace-split-layout";
import { ItemTypeEditor } from "@/components/items/item-type-editor";
import { CodeTypeTabs } from "@/components/items/code-type-tabs";
import { ItemDeleteDialogs } from "@/features/items/components/item-delete-dialogs";
import { ItemOrganizePanel } from "@/features/items/components/item-organize-panel";
import {
  useItemWorkspace,
  type ItemRecord,
} from "@/features/items/hooks/use-item-workspace";
import { getNoteColor } from "@/features/items/item-metadata";
import { ShareItemDialog } from "@/features/sharing/components/share-item-dialog";
import { toast } from "sonner";
import {
  archiveItemAction,
  restoreItemAction,
  trashItemAction,
} from "@/features/items/item.actions";
import { getActionErrorMessage } from "@/lib/action-error";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";

function emptyIllustrationFor(
  title: string,
  status?: ItemStatus,
): IllustrationName {
  if (status === "TRASHED" || status === "ARCHIVED") return "empty";
  if (title === "Notes") return "notes";
  if (title === "Code" || title === "AI Prompts") return "code";
  if (title === "Saved Links") return "links";
  if (title === "Files") return "empty";
  return "empty";
}

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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const ws = useItemWorkspace({
    workspaceId,
    type,
    types,
    status,
    title,
    favoritesOnly,
    projectId,
    collectionId,
    initialItems,
  });

  function renderCreateNoteColorPicker(compact = false) {
    if (!ws.isNotesPage || !ws.canCreate) return null;
    if (compact) {
      return (
        <details className="workspace-sidebar-extras">
          <summary className="workspace-sidebar-extras-summary">Default color</summary>
          <NoteColorPicker value={ws.createNoteColor} onChange={ws.handleCreateNoteColorChange} />
        </details>
      );
    }
    return (
      <div className="note-color-row create-note-color-row">
        <span className="note-color-label">New note color</span>
        <NoteColorPicker value={ws.createNoteColor} onChange={ws.handleCreateNoteColorChange} />
      </div>
    );
  }

  function renderCard(item: ItemRecord) {
    const isChecked = ws.getItemChecked(item.metadata);
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
        isActive={ws.itemId === item.id}
        variant={ws.splitLayout ? "sidebar" : "card"}
        noteColorId={item.type === "NOTE" ? getNoteColor(item.metadata) : undefined}
        onClick={() => ws.openItem(item)}
        onCheckChange={
          status === "TRASHED"
            ? undefined
            : (checked) => void ws.handleCardCheck(item, checked)
        }
        onPin={status === "ACTIVE" ? () => void ws.handleCardPin(item) : undefined}
        onFavorite={() => void ws.handleCardFavorite(item)}
        onArchive={status === "ACTIVE" ? () => void ws.handleCardArchive(item) : undefined}
        onRestore={status === "TRASHED" ? () => void ws.handleCardRestore(item) : undefined}
        onDelete={
          status !== "TRASHED" ? () => void ws.handleCardDelete(item) : undefined
        }
        onPermanentDelete={
          status === "TRASHED"
            ? () => void ws.handlePermanentDelete(item)
            : undefined
        }
      />
    );
  }

  function renderListSidebar() {
    return (
      <aside className="item-workspace-list" aria-label={`${title} list`}>
        <div className="item-workspace-list-header">
          {types?.length ? (
            <>
              <PageHint id="code">
                Save snippets and terminal commands you want to reuse.
              </PageHint>
              <CodeTypeTabs value={ws.codeTab} onChange={ws.setCodeTab} />
            </>
          ) : null}
          <div className="workspace-list-toolbar">
            {ws.canCreate ? (
              <Button onClick={() => void ws.handleCreate()} size="sm" className="workspace-new-btn">
                <Plus className="h-4 w-4" />
                {ws.getCreateLabel()}
              </Button>
            ) : null}
            <div className="relative workspace-list-search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={ws.filter}
                onChange={(e) => ws.setFilter(e.target.value)}
                aria-label={`Search ${title.toLowerCase()}`}
                className="pl-9 h-9"
              />
            </div>
          </div>
          {renderCreateNoteColorPicker(true)}
        </div>
        <div className="item-workspace-list-scroll">
          {ws.loading ? (
            <ItemListSkeleton rows={8} />
          ) : ws.filteredItems.length === 0 ? (
            <div className="item-workspace-list-empty">
              <p>{emptyDescription}</p>
              {ws.canCreate ? (
                <Button variant="link" onClick={() => void ws.handleCreate()}>
                  Create your first {ws.itemLabel}
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="item-workspace-list-view item-workspace-sidebar-rows">
              {ws.pinnedItems.length > 0 ? (
                <section className="item-list-section">
                  <p className="item-list-section-label">Pinned</p>
                  {ws.pinnedItems.map(renderCard)}
                </section>
              ) : null}
              {ws.otherItems.length > 0 ? (
                <section className="item-list-section">
                  {ws.pinnedItems.length > 0 ? (
                    <p className="item-list-section-label">All {title.toLowerCase()}</p>
                  ) : null}
                  {ws.otherItems.map(renderCard)}
                </section>
              ) : null}
              {ws.hasMore && !ws.filter ? (
                <Button
                  variant="outline"
                  className="w-full item-workspace-list-load-more"
                  disabled={ws.loadingMore}
                  onClick={() => void ws.loadItems(true, ws.items.length)}
                >
                  {ws.loadingMore ? (
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
    if (ws.itemId && ws.loading && !ws.selected) {
      return <ItemDetailSkeleton />;
    }

    if (ws.itemId && !ws.loading && !ws.selected) {
      return (
        <div className="item-workspace-empty workspace-empty-pane">
          <EmptyState
            className="workspace-empty-state"
            illustration="error"
            title="Could not find this item"
            description="It may have been deleted or moved."
            primaryAction={{
              label: `Back to ${title.toLowerCase()}`,
              onClick: ws.closeDetail,
            }}
          />
        </div>
      );
    }

    if (!ws.selected) {
      return (
        <div className="item-workspace-empty workspace-empty-pane">
          <EmptyState
            className="workspace-empty-state"
            illustration={emptyIllustrationFor(title, status)}
            title={`Select a ${ws.itemLabel}`}
            description={`Choose a ${ws.itemLabel} from the sidebar or start a new one.`}
            primaryAction={
              ws.canCreate
                ? {
                    label: ws.getCreateLabel(),
                    onClick: () => void ws.handleCreate(),
                  }
                : undefined
            }
          />
        </div>
      );
    }

    const selected = ws.selected;
    const isNotionSplit = ws.splitLayout && !showBack;

    const titleInput = (
      <Input
        value={selected.title}
        onChange={(e) => {
          const nextTitle = e.target.value;
          ws.setSelected({ ...selected, title: nextTitle });
          ws.setSelectedItemTitle(nextTitle || "Untitled");
        }}
        onBlur={async () => {
          await ws.updateSelectedField({ title: selected.title });
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
                onClick={ws.closeDetail}
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
                void ws.updateSelectedField({ isPinned: !selected.isPinned })
              }
              onToggleFavorite={() =>
                void ws.updateSelectedField({ isFavorite: !selected.isFavorite })
              }
              onShare={status === "TRASHED" ? undefined : () => ws.setShareOpen(true)}
              onDetails={
                status === "TRASHED" ? undefined : () => setDetailsOpen(true)
              }
              onArchive={
                status === "ACTIVE"
                  ? async () => {
                      try {
                        await archiveItemAction(workspaceId, selected.id);
                        toast.success("Archived", {
                          action: {
                            label: "Undo",
                            onClick: () => {
                              void restoreItemAction(workspaceId, selected.id).then(
                                () => void ws.loadItems(),
                              );
                            },
                          },
                        });
                        ws.closeDetail();
                        void ws.loadItems();
                      } catch (error) {
                        toast.error(getActionErrorMessage(error, "Could not archive"));
                      }
                    }
                  : undefined
              }
              onRestore={
                status === "ARCHIVED" || status === "TRASHED"
                  ? async () => {
                      try {
                        await restoreItemAction(workspaceId, selected.id);
                        toast.success("Restored!");
                        ws.closeDetail();
                        void ws.loadItems();
                      } catch (error) {
                        toast.error(getActionErrorMessage(error, "Could not restore"));
                      }
                    }
                  : undefined
              }
              onDelete={() =>
                status === "TRASHED"
                  ? ws.setPermanentDeleteDialogOpen(true)
                  : void (async () => {
                      try {
                        await trashItemAction(workspaceId, selected.id);
                        toast.success("Moved to Trash", {
                          action: {
                            label: "Undo",
                            onClick: () => {
                              void restoreItemAction(workspaceId, selected.id).then(
                                () => void ws.loadItems(),
                              );
                            },
                          },
                        });
                        ws.closeDetail();
                        void ws.loadItems();
                      } catch (error) {
                        toast.error(
                          getActionErrorMessage(error, "Could not move to Trash"),
                        );
                      }
                    })()
              }
              onPermanentDelete={
                status === "TRASHED"
                  ? () => ws.setPermanentDeleteDialogOpen(true)
                  : undefined
              }
            />
          </div>
          {!isNotionSplit ? titleInput : null}
        </div>

        <div className="item-workspace-detail-body">
          <div className="item-workspace-detail-inner">
            {isNotionSplit ? titleInput : null}

            <ItemTypeEditor
              item={selected}
              workspaceId={workspaceId}
              isNotionSplit={isNotionSplit}
              onSaveNote={ws.handleSave}
              onUpdate={ws.updateSelectedField}
            />

            <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Details</SheetTitle>
                </SheetHeader>
                <div className="details-drawer-body">
                  <ItemOrganizePanel
                    className="item-organize-panel--drawer"
                    workspaceId={workspaceId}
                    itemId={selected.id}
                    projectId={selected.projectId}
                    collectionId={selected.collectionId}
                    tagIds={ws.tagIds}
                    onUpdate={async (fields) => {
                      await ws.updateSelectedField(fields);
                    }}
                    onRestoreRevision={async (revision) => {
                      await ws.updateSelectedField({
                        content: revision.content,
                        plainText: revision.plainText,
                      });
                      toast.success("Restored to this version");
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </>
    );
  }

  function renderDialogs() {
    return (
      <>
        <ItemDeleteDialogs
          trashOpen={ws.deleteDialogOpen}
          permanentOpen={ws.permanentDeleteDialogOpen}
          cardTarget={ws.cardDeleteTarget}
          onConfirmPermanent={async () => {
            if (!ws.selected) return;
            await ws.handlePermanentDelete(ws.selected);
            ws.setPermanentDeleteDialogOpen(false);
          }}
          onCancelPermanent={() => ws.setPermanentDeleteDialogOpen(false)}
          onConfirmTrash={async () => {
            if (!ws.selected) return;
            try {
              await trashItemAction(workspaceId, ws.selected.id);
              toast.success("Moved to Trash");
              ws.setDeleteDialogOpen(false);
              ws.closeDetail();
              void ws.loadItems();
            } catch (error) {
              toast.error(getActionErrorMessage(error, "Could not move to Trash"));
            }
          }}
          onCancelTrash={() => ws.setDeleteDialogOpen(false)}
          onConfirmCardTrash={async () => {
            if (ws.cardDeleteTarget) await ws.handleCardDelete(ws.cardDeleteTarget);
          }}
          onCancelCard={() => ws.setCardDeleteTarget(null)}
        />
        {ws.selected ? (
          <ShareItemDialog
            open={ws.shareOpen}
            onOpenChange={ws.setShareOpen}
            workspaceId={workspaceId}
            itemId={ws.selected.id}
            itemTitle={ws.selected.title}
          />
        ) : null}
      </>
    );
  }

  if (ws.splitLayout) {
    return (
      <WorkspaceSplitLayout
        sidebar={renderListSidebar()}
        detail={renderItemEditor(false)}
        footer={renderDialogs()}
      />
    );
  }

  if (ws.isDetailView) {
    return (
      <div className="item-detail-page item-detail-page--editor">
        {renderItemEditor(true)}
        {renderDialogs()}
      </div>
    );
  }

  return (
    <div className="item-list-page">
      <div className="item-list-toolbar">
        {types?.length ? (
          <>
            <PageHint id="code">
              Save snippets and terminal commands you want to reuse.
            </PageHint>
            <CodeTypeTabs value={ws.codeTab} onChange={ws.setCodeTab} />
          </>
        ) : null}
        {ws.canCreate ? (
          <Button onClick={() => void ws.handleCreate()} className="item-new-btn">
            <Plus className="h-4 w-4" />
            New {ws.codeTab === "commands" ? "command" : types?.length ? "snippet" : title === "Saved Links" ? "saved link" : title.replace(/s$/, "").toLowerCase()}
          </Button>
        ) : null}
        {renderCreateNoteColorPicker()}

        <div className="item-list-toolbar-row">
          <div className="relative flex-1 item-list-search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={ws.filter}
              onChange={(e) => ws.setFilter(e.target.value)}
              aria-label={`Search ${title.toLowerCase()}`}
              className="pl-9 h-11"
            />
          </div>
          {type === "NOTE" ? (
            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`view-toggle-btn${ws.viewMode === "grid" ? " view-toggle-btn--active" : ""}`}
                onClick={() => ws.setViewMode("grid")}
                aria-pressed={ws.viewMode === "grid"}
              >
                <Grid3x3 className="h-4 w-4 inline mr-1" />
                Cards
              </button>
              <button
                type="button"
                className={`view-toggle-btn${ws.viewMode === "list" ? " view-toggle-btn--active" : ""}`}
                onClick={() => ws.setViewMode("list")}
                aria-pressed={ws.viewMode === "list"}
              >
                <List className="h-4 w-4 inline mr-1" />
                List
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {ws.loading ? (
        ws.viewMode === "grid" ? (
          <ItemGridSkeleton count={6} />
        ) : (
          <ItemListSkeleton rows={6} />
        )
      ) : ws.filteredItems.length === 0 ? (
        <EmptyState
          illustration={emptyIllustrationFor(title, status)}
          title={
            status === "TRASHED"
              ? "Trash is empty."
              : status === "ARCHIVED"
                ? "Nothing archived."
                : `No ${title.toLowerCase()} yet.`
          }
          description={emptyDescription}
          primaryAction={
            ws.canCreate
              ? {
                  label:
                    title === "Notes"
                      ? "New note"
                      : title === "Saved Links"
                        ? "Save link"
                        : title === "Code"
                          ? "Save code"
                          : `New ${title.replace(/s$/, "").toLowerCase()}`,
                  onClick: () => void ws.handleCreate(),
                }
              : undefined
          }
        />
      ) : (
        <ContentFade>
          {ws.pinnedItems.length > 0 ? (
            <section className="item-cards-section">
              <p className="item-cards-section-label">Pinned</p>
              <div
                className={
                  ws.viewMode === "grid"
                    ? "item-workspace-cards"
                    : "item-workspace-list-view"
                }
              >
                {ws.pinnedItems.map(renderCard)}
              </div>
            </section>
          ) : null}

          {ws.otherItems.length > 0 ? (
            <section className="item-cards-section">
              {ws.pinnedItems.length > 0 ? (
                <p className="item-cards-section-label">All {title.toLowerCase()}</p>
              ) : null}
              <div
                className={
                  ws.viewMode === "grid"
                    ? "item-workspace-cards"
                    : "item-workspace-list-view"
                }
              >
                {ws.otherItems.map(renderCard)}
              </div>
            </section>
          ) : null}

          {ws.hasMore && !ws.filter ? (
            <div className="item-list-load-more">
              <Button
                variant="outline"
                className="w-full"
                disabled={ws.loadingMore}
                onClick={() => void ws.loadItems(true, ws.items.length)}
              >
                {ws.loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Load more
              </Button>
            </div>
          ) : null}
        </ContentFade>
      )}

      {renderDialogs()}
    </div>
  );
}
