import { test, expect } from "@playwright/test";
import { signUp, uniqueTestEmail } from "./helpers/auth";

const hasDatabase = Boolean(process.env.DATABASE_URL);

test.describe("Authenticated flows", () => {
  test.skip(!hasDatabase, "Requires DATABASE_URL for sign-up and CRUD");

  test("sign up and create a note", async ({ page }) => {
    const email = uniqueTestEmail();

    await signUp(page, { email });

    await page.goto("/dashboard/notes?new=1");
    await page.waitForURL("**/dashboard/notes?item=**", { timeout: 30_000 });

    const titleInput = page.getByLabel("Item title");
    await titleInput.fill("E2E test note");
    await titleInput.blur();

    await expect(page.getByLabel("Item title")).toHaveValue("E2E test note");
  });

  test("create project and open drill-down", async ({ page }) => {
    const email = uniqueTestEmail();
    const projectName = `E2E Project ${Date.now()}`;

    await signUp(page, { email });
    await page.goto("/dashboard/projects");

    await page.getByRole("button", { name: "New project" }).click();
    await page.getByLabel("Name").fill(projectName);
    await page.getByRole("button", { name: "Create project" }).click();
    await expect(page.getByRole("dialog")).toBeHidden({ timeout: 10_000 });

    const projectLink = page.locator("a.key-card-title", { hasText: projectName });
    await expect(projectLink).toBeVisible();
    await projectLink.click();

    await expect(page).toHaveURL(/\/dashboard\/projects\/[^/]+$/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: projectName, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(/Nothing in this project yet/i),
    ).toBeVisible();
  });

  test("request password reset shows success", async ({ page }) => {
    const email = uniqueTestEmail();
    await signUp(page, { email });

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(
      page.getByText("Check your email for reset instructions"),
    ).toBeVisible();
  });
});
