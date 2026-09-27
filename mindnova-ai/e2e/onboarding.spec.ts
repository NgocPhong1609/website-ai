import { expect, test } from "@playwright/test";
import { API_URL, accessToken, registerStudent } from "./helpers";

test("onboarding: answers → generated plan → saved for the study plan", async ({ page }) => {
  await registerStudent(page);
  await expect(page).toHaveURL(/\/onboarding$/);

  // Steps cannot be skipped by URL.
  await page.goto("/onboarding/topics");
  await expect(page).toHaveURL(/\/onboarding\/goal$/);

  // Step 1 — goal (continue stays disabled until an answer is chosen).
  const next = page.getByRole("button", { name: "Tiếp tục" });
  await expect(next).toBeDisabled();
  await page.getByText("Lập trình viên Frontend").click();
  await next.click();

  // Step 2 — level.
  await expect(page).toHaveURL(/\/onboarding\/skills$/);
  await page.getByText("Mới bắt đầu").click();
  await page.getByRole("button", { name: "Tiếp tục" }).click();

  // Step 3 — topics depend on the goal; time is required.
  await expect(page).toHaveURL(/\/onboarding\/topics$/);
  await page.getByLabel("React", { exact: true }).check({ force: true });
  await page.getByLabel("TypeScript", { exact: true }).check({ force: true });
  const generate = page.getByRole("button", { name: "Tạo lộ trình" });
  await expect(generate).toBeDisabled();
  await page.getByText("1–2 giờ/ngày").click();

  // Answers survive a refresh.
  await page.reload();
  await expect(page.getByLabel("React", { exact: true })).toBeChecked();
  await generate.click();

  // Generating → plan (AI or deterministic fallback).
  await expect(page).toHaveURL(/\/onboarding\/plan$/, { timeout: 60_000 });
  await expect(page.getByRole("heading", { name: /Lộ trình Lập trình viên Frontend/ })).toBeVisible();
  await expect(page.getByText("Lộ trình đã sẵn sàng")).toBeVisible();
  expect(await page.getByRole("list", { name: "Các giai đoạn của lộ trình" }).locator(":scope > li").count()).toBeGreaterThanOrEqual(2);

  // The plan is stored on the account and drives the study plan.
  const token = await accessToken(page);
  const studyPlan = await page.request.get(`${API_URL}/student/study-plan`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const body = await studyPlan.json();
  expect(JSON.stringify(body)).toContain("Lộ trình AI: Lập trình viên Frontend");

  // Lesson analysis opens as an accessible dialog and closes with Escape.
  await page.getByRole("list", { name: "Các giai đoạn của lộ trình" }).getByRole("button").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Tổng quan" })).toBeVisible({ timeout: 45_000 });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page).toHaveURL(/\/study-plan/);
});
