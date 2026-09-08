import { describe, expect, it } from "vitest";
import { resolveNoteColorId } from "@/features/items/note-colors";
import { resolveTheme } from "@/lib/theme-utils";

describe("note color aliases", () => {
  it("maps legacy colors onto the stationery palette", () => {
    expect(resolveNoteColorId("honey")).toBe("cream");
    expect(resolveNoteColorId("mint")).toBe("sage");
    expect(resolveNoteColorId("lilac")).toBe("lavender");
    expect(resolveNoteColorId("coral")).toBe("rose");
    expect(resolveNoteColorId("slate")).toBe("neutral");
    expect(resolveNoteColorId("cream")).toBe("cream");
  });
});

describe("theme resolution", () => {
  it("keeps explicit light and dark preferences", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });
});
