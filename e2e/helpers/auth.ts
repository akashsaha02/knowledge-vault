import type { Page } from "@playwright/test";

export function uniqueTestEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function signUp(
  page: Page,
  {
    name = "E2E User",
    email,
    password = "TestPassword123!",
  }: {
    name?: string;
    email: string;
    password?: string;
  },
) {
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard**", { timeout: 30_000 });
}

export async function signIn(
  page: Page,
  {
    email,
    password = "TestPassword123!",
  }: {
    email: string;
    password?: string;
  },
) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/dashboard**", { timeout: 30_000 });
}
