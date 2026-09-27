import { expect, test } from "@playwright/test";

test("sidebar is an off-canvas drawer on small screens", async ({ page }) => {
  await page.goto("/explore");
  const nav = page.getByRole("link", { name: "Khám phá" }).first();
  await expect(nav).not.toBeInViewport();

  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(nav).toBeInViewport();

  await page.getByRole("link", { name: "Tổng quan" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Khám phá" }).first()).not.toBeInViewport();
});
