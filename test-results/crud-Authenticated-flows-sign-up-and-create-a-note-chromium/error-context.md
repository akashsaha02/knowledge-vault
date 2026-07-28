# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crud.spec.ts >> Authenticated flows >> sign up and create a note
- Location: e2e\crud.spec.ts:9:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /welcome/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /welcome/i })

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- complementary:
  - link "Nook":
    - /url: /dashboard
    - img "Nook"
  - button "Create something new":
    - img "plus"
    - text: New
  - menu:
    - menuitem "Home"
    - menuitem "My Notes"
    - menuitem "Projects"
    - menuitem "Saved Links"
    - menuitem "Search"
    - menuitem "More"
  - menu:
    - menuitem "Settings"
- banner:
  - button "Collapse sidebar":
    - img "menu-fold"
  - text: E2E User's Workspace
  - combobox
  - img "down"
  - button "Search":
    - img "search"
    - text: Search
  - button "Toggle theme":
    - img "moon"
  - button "Account menu":
    - img "user"
    - text: E2E User
- main:
  - heading "Good afternoon, E2E" [level=1]
  - paragraph: What would you like to do today?
  - region "Getting started checklist":
    - heading "Getting started (0/3 done)" [level=2]
    - button "Dismiss checklist":
      - img "close"
    - list:
      - listitem:
        - link "Write your first note":
          - /url: /dashboard/notes?new=1
      - listitem:
        - link "Save an interesting link":
          - /url: /dashboard/bookmarks?new=1
      - listitem:
        - link "Create your first project":
          - /url: /dashboard/projects
  - link "New Note Write something down":
    - /url: /dashboard/notes?new=1
  - link "Saved Links Save a useful website":
    - /url: /dashboard/bookmarks
  - link "My Code Save a piece of code":
    - /url: /dashboard/snippets
  - link "My Projects Keep things organised":
    - /url: /dashboard/projects
  - textbox "Take a note..."
  - status:
    - heading "Nothing saved yet" [level=3]
    - paragraph: Start by writing a note or saving a link — everything you create will appear here.
    - link "Write a note":
      - /url: /dashboard/notes?new=1
      - button "Write a note"
    - link "Save a link":
      - /url: /dashboard/bookmarks?new=1
      - button "Save a link"
- alert
- dialog "Welcome to Nook":
  - button "Close":
    - img "close"
  - text: Welcome to Nook
  - paragraph: This is your place to save ideas, notes, links, and projects. You can write notes, save useful websites, store code, and keep everything organised.
  - paragraph: Everything you save stays private and only you can see it.
  - button "I'll look around first"
  - button "Write my first note"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { signUp, uniqueTestEmail } from "./helpers/auth";
  3  | 
  4  | const hasDatabase = Boolean(process.env.DATABASE_URL);
  5  | 
  6  | test.describe("Authenticated flows", () => {
  7  |   test.skip(!hasDatabase, "Requires DATABASE_URL for sign-up and CRUD");
  8  | 
  9  |   test("sign up and create a note", async ({ page }) => {
  10 |     const email = uniqueTestEmail();
  11 | 
  12 |     await signUp(page, { email });
> 13 |     await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  14 | 
  15 |     await page.goto("/dashboard/notes?new=1");
  16 |     await page.waitForURL("**/dashboard/notes?item=**", { timeout: 30_000 });
  17 | 
  18 |     const titleInput = page.getByLabel("Item title");
  19 |     await titleInput.fill("E2E test note");
  20 |     await titleInput.blur();
  21 | 
  22 |     await expect(page.getByLabel("Item title")).toHaveValue("E2E test note");
  23 |   });
  24 | 
  25 |   test("create project and open drill-down", async ({ page }) => {
  26 |     const email = uniqueTestEmail();
  27 |     const projectName = `E2E Project ${Date.now()}`;
  28 | 
  29 |     await signUp(page, { email });
  30 |     await page.goto("/dashboard/projects");
  31 | 
  32 |     await page.getByRole("button", { name: "New project" }).click();
  33 |     await page.getByLabel("Name").fill(projectName);
  34 |     await page.getByRole("button", { name: "Create project" }).click();
  35 | 
  36 |     await expect(page.getByRole("link", { name: projectName })).toBeVisible();
  37 |     await page.getByRole("link", { name: projectName }).click();
  38 | 
  39 |     await expect(page).toHaveURL(/\/dashboard\/projects\//);
  40 |     await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
  41 |     await expect(
  42 |       page.getByText("No items in this project yet"),
  43 |     ).toBeVisible();
  44 |   });
  45 | 
  46 |   test("request password reset shows success", async ({ page }) => {
  47 |     const email = uniqueTestEmail();
  48 |     await signUp(page, { email });
  49 | 
  50 |     await page.goto("/forgot-password");
  51 |     await page.getByLabel("Email").fill(email);
  52 |     await page.getByRole("button", { name: "Send reset link" }).click();
  53 | 
  54 |     await expect(
  55 |       page.getByText("Check your email for reset instructions"),
  56 |     ).toBeVisible();
  57 |   });
  58 | });
  59 | 
```