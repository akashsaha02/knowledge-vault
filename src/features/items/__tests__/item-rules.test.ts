import { describe, expect, it } from "vitest";
import {
  canSeeOthersPrivateItems,
  itemIsVisibleToUser,
  itemVisibilityWhere,
} from "@/features/items/item-access";
import {
  canPermanentlyDeleteItem,
  nextStatusAfterDraftEdit,
  shouldCreateRevision,
} from "@/features/items/item-lifecycle";
import {
  getCreateMenuItems,
  getDefaultCreatePayload,
  ITEM_TYPE_REGISTRY,
  TYPE_ROUTES,
} from "@/features/items/item-type-registry";
import { hasPermission, canEditItem } from "@/features/workspaces/workspace.permissions";

describe("workspace role permissions", () => {
  it("gives OWNER full workspace control", () => {
    expect(hasPermission("OWNER", "view")).toBe(true);
    expect(hasPermission("OWNER", "create")).toBe(true);
    expect(hasPermission("OWNER", "editAll")).toBe(true);
    expect(hasPermission("OWNER", "deleteWorkspace")).toBe(true);
  });

  it("gives ADMIN editAll but not workspace deletion", () => {
    expect(hasPermission("ADMIN", "editAll")).toBe(true);
    expect(hasPermission("ADMIN", "invite")).toBe(true);
    expect(hasPermission("ADMIN", "deleteWorkspace")).toBe(false);
  });

  it("lets MEMBER create and edit own items only", () => {
    expect(hasPermission("MEMBER", "create")).toBe(true);
    expect(hasPermission("MEMBER", "editOwn")).toBe(true);
    expect(hasPermission("MEMBER", "editAll")).toBe(false);
  });

  it("restricts VIEWER to view", () => {
    expect(hasPermission("VIEWER", "view")).toBe(true);
    expect(hasPermission("VIEWER", "create")).toBe(false);
    expect(hasPermission("VIEWER", "editOwn")).toBe(false);
  });

  it("applies canEditItem consistently", () => {
    expect(canEditItem("OWNER", "other", "author")).toBe(true);
    expect(canEditItem("ADMIN", "other", "author")).toBe(true);
    expect(canEditItem("MEMBER", "author", "author")).toBe(true);
    expect(canEditItem("MEMBER", "other", "author")).toBe(false);
    expect(canEditItem("VIEWER", "author", "author")).toBe(false);
  });
});

describe("PRIVATE item visibility", () => {
  const privateItem = { visibility: "PRIVATE" as const, createdById: "author" };
  const workspaceItem = { visibility: "WORKSPACE" as const, createdById: "author" };

  it("lets the creator see their PRIVATE item", () => {
    expect(
      itemIsVisibleToUser(privateItem, {
        userId: "author",
        canSeeOthersPrivateItems: false,
      }),
    ).toBe(true);
  });

  it("hides PRIVATE items from members without editAll", () => {
    expect(
      itemIsVisibleToUser(privateItem, {
        userId: "member",
        canSeeOthersPrivateItems: false,
      }),
    ).toBe(false);
  });

  it("lets OWNER/ADMIN see others' PRIVATE items", () => {
    expect(canSeeOthersPrivateItems("OWNER")).toBe(true);
    expect(canSeeOthersPrivateItems("ADMIN")).toBe(true);
    expect(canSeeOthersPrivateItems("MEMBER")).toBe(false);
    expect(canSeeOthersPrivateItems("VIEWER")).toBe(false);
    expect(
      itemIsVisibleToUser(privateItem, {
        userId: "admin",
        canSeeOthersPrivateItems: true,
      }),
    ).toBe(true);
  });

  it("shows WORKSPACE-visible items to any member", () => {
    expect(
      itemIsVisibleToUser(workspaceItem, {
        userId: "member",
        canSeeOthersPrivateItems: false,
      }),
    ).toBe(true);
  });

  it("uses the same Prisma filter for list queries and search fallback", () => {
    expect(itemVisibilityWhere("member", false)).toEqual({
      OR: [
        { visibility: { not: "PRIVATE" } },
        { createdById: "member" },
      ],
    });
    expect(itemVisibilityWhere("owner", true)).toEqual({});
  });
});

describe("item lifecycle", () => {
  it("promotes DRAFT to ACTIVE when content is edited", () => {
    expect(nextStatusAfterDraftEdit("DRAFT", true)).toBe("ACTIVE");
    expect(nextStatusAfterDraftEdit("DRAFT", false)).toBeUndefined();
    expect(nextStatusAfterDraftEdit("ACTIVE", true)).toBeUndefined();
  });

  it("allows permanent delete only from trash with deletedAt", () => {
    expect(
      canPermanentlyDeleteItem({ status: "TRASHED", deletedAt: new Date() }),
    ).toBe(true);
    expect(
      canPermanentlyDeleteItem({ status: "ACTIVE", deletedAt: null }),
    ).toBe(false);
    expect(
      canPermanentlyDeleteItem({ status: "TRASHED", deletedAt: null }),
    ).toBe(false);
    expect(
      canPermanentlyDeleteItem({ status: "ARCHIVED", deletedAt: null }),
    ).toBe(false);
  });

  it("coalesces revisions within the 5-minute window when text is unchanged", () => {
    const last = { createdAt: new Date(1_000), plainText: "same" };
    expect(
      shouldCreateRevision({
        lastRevision: last,
        nextPlainText: "same",
        now: 1_000 + 60_000,
      }),
    ).toBe(false);
    expect(
      shouldCreateRevision({
        lastRevision: last,
        nextPlainText: "changed",
        now: 1_000 + 60_000,
      }),
    ).toBe(true);
    expect(
      shouldCreateRevision({
        lastRevision: last,
        nextPlainText: "same",
        now: 1_000 + 6 * 60_000,
      }),
    ).toBe(true);
    expect(
      shouldCreateRevision({ lastRevision: null, nextPlainText: "first" }),
    ).toBe(true);
  });
});

describe("item type registry", () => {
  it("keeps create surfaces on one source of truth", () => {
    const keys = getCreateMenuItems().map((item) => item.key);
    expect(keys).toEqual(["note", "snippet", "command", "bookmark", "prompt", "file"]);
    expect(ITEM_TYPE_REGISTRY.PROMPT.showInCreateMenu).toBe(true);
  });

  it("preserves existing create URLs", () => {
    expect(ITEM_TYPE_REGISTRY.NOTE.createHref).toBe("/dashboard/notes?new=1");
    expect(ITEM_TYPE_REGISTRY.COMMAND.createHref).toBe(
      "/dashboard/snippets?tab=commands&new=1",
    );
    expect(TYPE_ROUTES.COMMAND).toBe("/dashboard/snippets?tab=commands");
  });

  it("returns stable default metadata per type", () => {
    expect(getDefaultCreatePayload("SNIPPET").metadata).toEqual({
      language: "typescript",
      code: "",
    });
    expect(getDefaultCreatePayload("COMMAND").title).toBe("Untitled command");
    expect(getDefaultCreatePayload("BOOKMARK").metadata).toEqual({ url: "" });
  });
});
