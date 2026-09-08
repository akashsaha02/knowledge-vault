import { describe, expect, it } from "vitest";
import { importPayloadSchema } from "@/features/import-export/import.schema";

describe("import payload schema", () => {
  it("accepts current version 1 export shape", () => {
    const parsed = importPayloadSchema.parse({
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      workspaceId: "ws_1",
      items: [
        {
          id: "item_1",
          type: "NOTE",
          title: "Hello",
          slug: "hello",
          plainText: "body",
          content: { format: "html", html: "<p>body</p>" },
          metadata: { noteColor: "cream" },
          status: "ACTIVE",
          tags: ["inbox"],
        },
      ],
    });

    expect(parsed.version).toBe(1);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0]?.type).toBe("NOTE");
  });

  it("rejects unknown item types", () => {
    expect(() =>
      importPayloadSchema.parse({
        version: 1,
        items: [{ title: "x", type: "NOT_A_TYPE" }],
      }),
    ).toThrow();
  });

  it("rejects more than 1000 items", () => {
    expect(() =>
      importPayloadSchema.parse({
        version: 1,
        items: Array.from({ length: 1001 }, (_, i) => ({
          title: `Item ${i}`,
          type: "NOTE",
        })),
      }),
    ).toThrow();
  });

  it("rejects malformed JSON objects without items", () => {
    expect(() => importPayloadSchema.parse({ version: 1 })).toThrow();
  });
});
