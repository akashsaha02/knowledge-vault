import { describe, expect, it } from "vitest";
import { resolveNoteColorId } from "@/features/items/note-colors";
import { getAvatarPaletteIndex, getInitials } from "@/lib/avatar-utils";
import { getTimeOfDayGreeting } from "@/lib/greeting";
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

describe("avatar initials", () => {
  it("uses first and last name letters", () => {
    expect(getInitials("Alex Morgan")).toBe("AM");
    expect(getInitials("Jordan")).toBe("JO");
    expect(getInitials("  ")).toBe("?");
  });

  it("picks a stable palette for the same name", () => {
    expect(getAvatarPaletteIndex("Alex")).toBe(getAvatarPaletteIndex("Alex"));
  });
});

describe("time of day greeting", () => {
  it("returns morning, afternoon, and evening bands", () => {
    expect(getTimeOfDayGreeting(new Date("2026-09-08T08:00:00"))).toBe(
      "Good morning",
    );
    expect(getTimeOfDayGreeting(new Date("2026-09-08T14:00:00"))).toBe(
      "Good afternoon",
    );
    expect(getTimeOfDayGreeting(new Date("2026-09-08T20:00:00"))).toBe(
      "Good evening",
    );
  });
});
