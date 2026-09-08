import type { ItemType } from "@/generated/prisma/client";

export type ItemTypeDefinition = {
  type: ItemType;
  key: string;
  label: string;
  singular: string;
  plural: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  route: string;
  createHref: string;
  defaultTitle: string;
  defaultMetadata: Record<string, unknown>;
  showInCreateMenu: boolean;
  createOrder: number;
  shortcut?: string;
};

export const ITEM_TYPE_REGISTRY: Record<ItemType, ItemTypeDefinition> = {
  NOTE: {
    type: "NOTE",
    key: "note",
    label: "Note",
    singular: "note",
    plural: "Notes",
    description: "Capture an idea",
    emptyTitle: "No notes yet.",
    emptyDescription: "Capture something you don't want to lose.",
    route: "/dashboard/notes",
    createHref: "/dashboard/notes?new=1",
    defaultTitle: "Untitled note",
    defaultMetadata: {},
    showInCreateMenu: true,
    createOrder: 1,
    shortcut: "Mod+N",
  },
  BOOKMARK: {
    type: "BOOKMARK",
    key: "bookmark",
    label: "Saved Link",
    singular: "link",
    plural: "Saved Links",
    description: "Save something from the web",
    emptyTitle: "No saved links yet.",
    emptyDescription: "Save pages you want to find again.",
    route: "/dashboard/bookmarks",
    createHref: "/dashboard/bookmarks?new=1",
    defaultTitle: "Untitled link",
    defaultMetadata: { url: "" },
    showInCreateMenu: true,
    createOrder: 4,
  },
  SNIPPET: {
    type: "SNIPPET",
    key: "snippet",
    label: "Code snippet",
    singular: "snippet",
    plural: "Snippets",
    description: "Save reusable code",
    emptyTitle: "No saved code yet.",
    emptyDescription: "Keep useful snippets and commands here.",
    route: "/dashboard/snippets",
    createHref: "/dashboard/snippets?new=1",
    defaultTitle: "Untitled code",
    defaultMetadata: { language: "typescript", code: "" },
    showInCreateMenu: true,
    createOrder: 2,
    shortcut: "Mod+Shift+N",
  },
  COMMAND: {
    type: "COMMAND",
    key: "command",
    label: "Command",
    singular: "command",
    plural: "Commands",
    description: "Keep a terminal command",
    emptyTitle: "No commands yet.",
    emptyDescription: "Keep useful snippets and commands here.",
    route: "/dashboard/snippets?tab=commands",
    createHref: "/dashboard/snippets?tab=commands&new=1",
    defaultTitle: "Untitled command",
    defaultMetadata: { shell: "bash", command: "" },
    showInCreateMenu: true,
    createOrder: 3,
  },
  FILE: {
    type: "FILE",
    key: "file",
    label: "File",
    singular: "file",
    plural: "Files",
    description: "Store a file",
    emptyTitle: "No files yet.",
    emptyDescription: "Upload a file you want to keep with your notes.",
    route: "/dashboard/files",
    createHref: "/dashboard/files?new=1",
    defaultTitle: "Untitled file",
    defaultMetadata: {},
    showInCreateMenu: true,
    createOrder: 6,
  },
  PROMPT: {
    type: "PROMPT",
    key: "prompt",
    label: "AI Prompt",
    singular: "prompt",
    plural: "AI Prompts",
    description: "Keep a reusable prompt",
    emptyTitle: "No prompts yet.",
    emptyDescription: "Save prompts you reuse with AI tools.",
    route: "/dashboard/prompts",
    createHref: "/dashboard/prompts?new=1",
    defaultTitle: "Untitled prompt",
    defaultMetadata: { template: "" },
    showInCreateMenu: true,
    createOrder: 5,
  },
};

export function getItemTypeDefinition(type: ItemType): ItemTypeDefinition {
  return ITEM_TYPE_REGISTRY[type];
}

export function getCreateMenuItems() {
  return Object.values(ITEM_TYPE_REGISTRY)
    .filter((definition) => definition.showInCreateMenu)
    .sort((a, b) => a.createOrder - b.createOrder)
    .map((definition) => ({
      key: definition.key,
      label: definition.label,
      description: definition.description,
      href: definition.createHref,
      type: definition.type,
    }));
}

export function getDefaultCreatePayload(
  type: ItemType,
  extras?: { metadata?: Record<string, unknown> },
) {
  const definition = ITEM_TYPE_REGISTRY[type];
  return {
    type,
    title: definition.defaultTitle,
    plainText: "",
    metadata: { ...definition.defaultMetadata, ...extras?.metadata },
  };
}

export const TYPE_ROUTES: Partial<Record<ItemType, string>> = {
  NOTE: ITEM_TYPE_REGISTRY.NOTE.route,
  SNIPPET: ITEM_TYPE_REGISTRY.SNIPPET.route,
  COMMAND: ITEM_TYPE_REGISTRY.COMMAND.route,
  BOOKMARK: ITEM_TYPE_REGISTRY.BOOKMARK.route,
  PROMPT: ITEM_TYPE_REGISTRY.PROMPT.route,
  FILE: ITEM_TYPE_REGISTRY.FILE.route,
};
