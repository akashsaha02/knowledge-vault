import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";
import {
  detectCommandRisk,
  RISK_LABELS,
} from "@/features/items/command.utils";
import { hasPermission } from "@/features/workspaces/workspace.permissions";
import { validateBookmarkUrl } from "@/lib/url-validation";

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(uniqueSlug("Test", "1")).toBe("test-1");
  });
});

describe("command risk detection", () => {
  it("flags destructive commands", () => {
    expect(detectCommandRisk("rm -rf /")).toBe("destructive");
    expect(RISK_LABELS.destructive).toBe("Destructive");
  });

  it("flags sudo commands for review", () => {
    expect(detectCommandRisk("sudo apt update")).toBe("review");
  });
});

describe("workspace permissions", () => {
  it("allows owners to delete workspace", () => {
    expect(hasPermission("OWNER", "deleteWorkspace")).toBe(true);
    expect(hasPermission("MEMBER", "deleteWorkspace")).toBe(false);
  });

  it("allows viewers to view only", () => {
    expect(hasPermission("VIEWER", "view")).toBe(true);
    expect(hasPermission("VIEWER", "create")).toBe(false);
  });
});

describe("bookmark URL validation", () => {
  it("rejects localhost URLs", () => {
    expect(() => validateBookmarkUrl("http://localhost/admin")).toThrow();
  });

  it("allows public https URLs", () => {
    expect(validateBookmarkUrl("https://example.com")).toBe(
      "https://example.com/",
    );
  });
});
