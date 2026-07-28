import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ?? "development-secret-change-me",
      BETTER_AUTH_URL:
        process.env.BETWRIGHT_BASE_URL ??
        process.env.BETTER_AUTH_URL ??
        "http://localhost:8000",
      NEXT_PUBLIC_APP_URL:
        process.env.PLAYWRIGHT_BASE_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:8000",
    },
  },
});
