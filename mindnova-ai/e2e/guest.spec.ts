import { expect, test } from "@playwright/test";
import { BASE_URL } from "./helpers";

test.describe("guest", () => {
  test("home page renders the public dashboard instead of crashing", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Chào mừng đến với\s*MindNova AI/ })).toBeVisible();
    await expect(page.getByText("Đã có lỗi xảy ra!")).toHaveCount(0);
  });

  test("protected student pages redirect to login", async ({ page }) => {
    for (const path of ["/profile", "/practice", "/study-plan", "/billing", "/courses/lesson"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("checkout without a course goes back to the catalog", async ({ page, context }) => {
    // Pretend to be signed in so middleware lets the request reach the page.
    await context.addCookies([
      { name: "accessToken", value: "e2e", url: BASE_URL },
      { name: "userRole", value: "student", url: BASE_URL },
    ]);
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/explore/);
  });
});
