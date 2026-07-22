import { describe, expect, it } from "vitest";
import { groupByType, highlightMatch } from "@/lib/search-utils";

describe("highlightMatch", () => {
  it("wraps matching text in mark tags", () => {
    expect(highlightMatch("Hello world", "world")).toBe(
      "Hello <mark>world</mark>",
    );
  });

  it("returns original text when query is empty", () => {
    expect(highlightMatch("Hello", "")).toBe("Hello");
  });
});

describe("groupByType", () => {
  it("groups items by type", () => {
    const grouped = groupByType([
      { type: "NOTE", id: "1" },
      { type: "SNIPPET", id: "2" },
      { type: "NOTE", id: "3" },
    ]);
    expect(grouped.NOTE).toHaveLength(2);
    expect(grouped.SNIPPET).toHaveLength(1);
  });
});
