import { describe, expect, it } from "vitest";
import {
  getAuthBaseUrl,
  getBrowserAuthBaseUrl,
  getTrustedOrigins,
  normalizeOrigin,
} from "@/lib/auth-url";

describe("normalizeOrigin", () => {
  it("returns origin from a full URL", () => {
    expect(normalizeOrigin("https://nook.example.com/app")).toBe(
      "https://nook.example.com",
    );
  });

  it("adds https for host-only Vercel values", () => {
    expect(normalizeOrigin("nook.vercel.app")).toBe("https://nook.vercel.app");
  });

  it("returns undefined for empty values", () => {
    expect(normalizeOrigin(undefined)).toBeUndefined();
    expect(normalizeOrigin("  ")).toBeUndefined();
  });
});

describe("getAuthBaseUrl", () => {
  it("uses localhost in development", () => {
    expect(
      getAuthBaseUrl({
        NODE_ENV: "development",
        BETTER_AUTH_URL: "http://localhost:8000",
      }),
    ).toBe("http://localhost:8000");
  });

  it("ignores localhost env copied from .env.example on Vercel", () => {
    expect(
      getAuthBaseUrl({
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        VERCEL_URL: "nook.vercel.app",
        BETTER_AUTH_URL: "http://localhost:8000",
        APP_URL: "http://localhost:8000",
      }),
    ).toBe("https://nook.vercel.app");
  });

  it("prefers an explicit production Better Auth URL", () => {
    expect(
      getAuthBaseUrl({
        NODE_ENV: "production",
        VERCEL_URL: "nook-git-main.vercel.app",
        BETTER_AUTH_URL: "https://nook.example.com",
      }),
    ).toBe("https://nook.example.com");
  });
});

describe("getTrustedOrigins", () => {
  it("does not trust localhost in production hosted deploys", () => {
    expect(
      getTrustedOrigins({
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        VERCEL_URL: "nook.vercel.app",
        BETTER_AUTH_URL: "http://localhost:8000",
      }),
    ).toEqual(["https://nook.vercel.app"]);
  });
});

describe("getBrowserAuthBaseUrl", () => {
  it("uses the page origin even when APP_URL points at localhost", () => {
    expect(
      getBrowserAuthBaseUrl(
        {
          NODE_ENV: "production",
          APP_URL: "http://localhost:8000",
        },
        "https://nook.example.com",
      ),
    ).toBe("https://nook.example.com");
  });
});
