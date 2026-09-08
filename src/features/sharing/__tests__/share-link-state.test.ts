import { describe, expect, it } from "vitest";
import {
  canCopySharedContent,
  isShareLinkUsable,
} from "@/features/sharing/share-link-state";

describe("share link usability", () => {
  const now = new Date("2026-09-08T00:00:00.000Z");

  it("accepts an active token", () => {
    expect(
      isShareLinkUsable({ revokedAt: null, expiresAt: null }, now),
    ).toBe(true);
  });

  it("rejects a revoked token", () => {
    expect(
      isShareLinkUsable(
        { revokedAt: new Date("2026-09-01T00:00:00.000Z"), expiresAt: null },
        now,
      ),
    ).toBe(false);
  });

  it("rejects an expired token", () => {
    expect(
      isShareLinkUsable(
        { revokedAt: null, expiresAt: new Date("2026-09-07T00:00:00.000Z") },
        now,
      ),
    ).toBe(false);
  });

  it("accepts a future expiry", () => {
    expect(
      isShareLinkUsable(
        { revokedAt: null, expiresAt: new Date("2026-09-09T00:00:00.000Z") },
        now,
      ),
    ).toBe(true);
  });

  it("gates copy on allowCopy", () => {
    expect(canCopySharedContent({ allowCopy: true })).toBe(true);
    expect(canCopySharedContent({ allowCopy: false })).toBe(false);
  });
});
