import { test, expect } from "@playwright/test";

test.describe("Dashboard navigation", () => {
  test("loads sign-in page", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("loads landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Knowledge Vault")).toBeVisible();
  });
});
