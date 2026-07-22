import { test, expect } from "@playwright/test";

test.describe("Knowledge Vault", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Knowledge Vault")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByText("Create account")).toBeVisible();
  });
});
