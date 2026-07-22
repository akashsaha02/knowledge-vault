import { afterEach, describe, expect, it, vi } from "vitest";
import { assertValidAttachmentStorageKey } from "@/features/attachments/attachment.utils";
import { getAuthSecret } from "@/lib/auth-secret";

describe("assertValidAttachmentStorageKey", () => {
  const workspaceId = "ws_abc";
  const userId = "user_xyz";
  const itemId = "item_123";

  it("accepts keys with the expected prefix", () => {
    expect(() =>
      assertValidAttachmentStorageKey(
        `${workspaceId}/${userId}/${itemId}/file.pdf`,
        workspaceId,
        userId,
        itemId,
      ),
    ).not.toThrow();
  });

  it("rejects keys from another workspace", () => {
    expect(() =>
      assertValidAttachmentStorageKey(
        `other_ws/${userId}/${itemId}/file.pdf`,
        workspaceId,
        userId,
        itemId,
      ),
    ).toThrow("Invalid storage key");
  });

  it("rejects keys from another user", () => {
    expect(() =>
      assertValidAttachmentStorageKey(
        `${workspaceId}/other_user/${itemId}/file.pdf`,
        workspaceId,
        userId,
        itemId,
      ),
    ).toThrow("Invalid storage key");
  });

  it("rejects path traversal attempts", () => {
    expect(() =>
      assertValidAttachmentStorageKey(
        `${workspaceId}/${userId}/${itemId}/../secret/file.pdf`,
        workspaceId,
        userId,
        itemId,
      ),
    ).toThrow("Invalid storage key");
  });
});

describe("getAuthSecret", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns development fallback when secret is unset", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("BETTER_AUTH_SECRET", "");

    expect(getAuthSecret()).toBe("development-secret-change-me");
  });

  it("requires BETTER_AUTH_SECRET in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BETTER_AUTH_SECRET", "");

    expect(() => getAuthSecret()).toThrow(
      "BETTER_AUTH_SECRET is required in production",
    );
  });
});
