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

  it("escapes HTML in the source before inserting mark tags", () => {
    expect(highlightMatch("<script>alert(1)</script> hello", "hello")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt; <mark>hello</mark>",
    );
  });

  it("does not treat query HTML as markup", () => {
    expect(highlightMatch("a <b> bold", "<b>")).toBe(
      "a <mark>&lt;b&gt;</mark> bold",
    );
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
