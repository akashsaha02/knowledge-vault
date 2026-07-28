import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "@/lib/email";

describe("sendEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("logs in development when no provider is configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("RESEND_API_KEY", "");
    const logSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    await sendEmail({
      to: "user@example.com",
      subject: "Test",
      text: "Hello",
    });

    expect(logSpy).toHaveBeenCalled();
  });

  it("throws in production when no provider is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "");

    await expect(
      sendEmail({
        to: "user@example.com",
        subject: "Test",
        text: "Hello",
      }),
    ).rejects.toThrow("RESEND_API_KEY is required");
  });
});
