"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  archiveItemAction,
  createItemAction,
  listItemsAction,
  permanentlyDeleteItemAction,
  restoreItemAction,
  trashItemAction,
  updateItemAction,
} from "@/features/items/item.actions";
import { getDefaultCreatePayload } from "@/features/items/item-type-registry";
import { getItemChecked, withItemChecked, withNoteColor } from "@/features/items/item-metadata";
import {
  readLastNoteColor,
  saveLastNoteColor,
  type NoteColorId,
} from "@/features/items/note-colors";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";
import { getActionErrorMessage } from "@/lib/action-error";
import { getItemHref } from "@/lib/nav-config";
import { completeChecklistTask } from "@/lib/onboarding-storage";
import { addRecentItem } from "@/lib/recent-storage";
import { useUiStore } from "@/stores/ui-store";

const PAGE_SIZE = 50;
const SPLIT_ITEM_TYPES = ["NOTE", "SNIPPET", "COMMAND", "PROMPT"] as const satisfies readonly ItemType[];

export type ItemRecord = Awaited<ReturnType<typeof listItemsAction>>[number];

export type UseItemWorkspaceArgs = {
  workspaceId: string;
  type?: ItemType;
  types?: ItemType[];
  status?: ItemStatus;
  title: string;
  favoritesOnly?: boolean;
  projectId?: string;
  collectionId?: string;
  initialItems?: ItemRecord[];
};

async function runMutation<T>(
  fn: () => Promise<T>,
  fallback: string,
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    toast.error(getActionErrorMessage(error, fallback));
    return undefined;
  }
}

export function useItemWorkspace({
  workspaceId,
  type,
  types,
  status = "ACTIVE",
  title,
  favoritesOnly,
  projectId,
  collectionId,
  initialItems,
}: UseItemWorkspaceArgs) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");
  const isDetailView = Boolean(itemId);
  const codeTab: "snippets" | "commands" =
    searchParams.get("tab") === "commands" ? "commands" : "snippets";
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
  const [shareOpen, setShareOpen] = useState(false);
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
      } catch (error) {
        toast.error(getActionErrorMessage(error, "Could not load items"));
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
      setSelectedItemTitle(found.title || "Untitled");
    }
  }, [itemId, items, setSelectedItemTitle]);

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

  function setCodeTab(tab: "snippets" | "commands") {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "commands") params.set("tab", "commands");
    else params.delete("tab");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  async function handleCreate() {
    const createType = activeType ?? "NOTE";
    const payload = getDefaultCreatePayload(
      createType,
      createType === "NOTE" ? { metadata: withNoteColor({}, createNoteColor) } : undefined,
    );

    const item = await runMutation(
      () =>
        createItemAction({
          workspaceId,
          ...payload,
          ...(status === "DRAFT" ? { status: "DRAFT" as const } : {}),
        }),
      "Could not create item",
    );
    if (!item) return;

    if (createType === "NOTE") completeChecklistTask("note");
    if (createType === "SNIPPET") completeChecklistTask("snippet");
    if (createType === "BOOKMARK") completeChecklistTask("bookmark");

    setItems((prev) => [item as ItemRecord, ...prev]);
    router.replace(getItemHref(item.type as ItemType, item.id));
  }

  const createFromQueryRef = useRef(false);
  const wantsNewItem = searchParams.has("new");

  useEffect(() => {
    if (!wantsNewItem) {
      createFromQueryRef.current = false;
      return;
    }
    if (!activeType || createFromQueryRef.current) return;
    createFromQueryRef.current = true;
    void handleCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsNewItem, activeType]);

  async function handleSave(json: unknown, plainText: string) {
    if (!selected) return;
    const updated = await runMutation(
      () =>
        updateItemAction({
          id: selected.id,
          workspaceId,
          content: json,
          plainText,
        }),
      "Could not save",
    );
    if (!updated) return;
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
    const result = await runMutation(
      () => permanentlyDeleteItemAction(workspaceId, item.id),
      "Could not delete",
    );
    if (!result) return;
    toast.success("Permanently deleted");
    if (selected?.id === item.id) {
      closeDetail();
    }
    void loadItems();
  }

  async function handleCardPin(item: ItemRecord) {
    const updated = await runMutation(
      () =>
        updateItemAction({
          id: item.id,
          workspaceId,
          isPinned: !item.isPinned,
        }),
      "Could not update pin",
    );
    if (!updated) return;
    syncItem(updated as ItemRecord, { preserveEditor: true });
    toast.success(item.isPinned ? "Unpinned" : "Pinned");
  }

  async function handleCardFavorite(item: ItemRecord) {
    const updated = await runMutation(
      () =>
        updateItemAction({
          id: item.id,
          workspaceId,
          isFavorite: !item.isFavorite,
        }),
      "Could not update favorite",
    );
    if (!updated) return;
    syncItem(updated as ItemRecord, { preserveEditor: true });
    toast.success(item.isFavorite ? "Removed from favorites" : "Added to favorites");
  }

  async function handleCardArchive(item: ItemRecord) {
    const result = await runMutation(
      () => archiveItemAction(workspaceId, item.id),
      "Could not archive",
    );
    if (!result) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (itemId === item.id) closeDetail();
    toast.success("Archived");
  }

  async function handleCardRestore(item: ItemRecord) {
    const result = await runMutation(
      () => restoreItemAction(workspaceId, item.id),
      "Could not restore",
    );
    if (!result) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (itemId === item.id) closeDetail();
    toast.success("Restored");
  }

  async function handleCardDelete(item: ItemRecord) {
    const result = await runMutation(
      () => trashItemAction(workspaceId, item.id),
      "Could not move to Trash",
    );
    if (!result) return;
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
    const updated = await runMutation(
      () =>
        updateItemAction({
          id: selected.id,
          workspaceId,
          ...fields,
        }),
      "Could not save changes",
    );
    if (!updated) return;
    const preserveEditor = fields.content === undefined && fields.plainText === undefined;
    syncItem(updated as ItemRecord, { preserveEditor });
  }

  async function handleCardCheck(item: ItemRecord, checked: boolean) {
    const updated = await runMutation(
      () =>
        updateItemAction({
          id: item.id,
          workspaceId,
          metadata: withItemChecked(item.metadata, checked),
        }),
      "Could not update item",
    );
    if (!updated) return;
    syncItem(updated as ItemRecord, { preserveEditor: true });
  }

  function handleCreateNoteColorChange(colorId: NoteColorId) {
    setCreateNoteColor(colorId);
    saveLastNoteColor(colorId);
  }

  const tagIds =
    selected?.tags?.map((entry: { tag: { id: string } }) => entry.tag.id) ?? [];

  return {
    workspaceId,
    type,
    types,
    status,
    title,
    itemId,
    isDetailView,
    codeTab,
    items,
    selected,
    setSelected,
    loading,
    loadingMore,
    hasMore,
    filter,
    setFilter,
    viewMode,
    setViewMode,
    deleteDialogOpen,
    setDeleteDialogOpen,
    permanentDeleteDialogOpen,
    setPermanentDeleteDialogOpen,
    cardDeleteTarget,
    setCardDeleteTarget,
    shareOpen,
    setShareOpen,
    createNoteColor,
    isNotesPage,
    filteredItems,
    pinnedItems,
    otherItems,
    canCreate,
    splitLayout,
    itemLabel,
    tagIds,
    getCreateLabel,
    openItem,
    closeDetail,
    setCodeTab,
    handleCreate,
    handleSave,
    handlePermanentDelete,
    handleCardPin,
    handleCardFavorite,
    handleCardArchive,
    handleCardRestore,
    handleCardDelete,
    handleCardCheck,
    updateSelectedField,
    handleCreateNoteColorChange,
    loadItems,
    getItemChecked,
    setSelectedItemTitle,
  };
}
