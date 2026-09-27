import { expect, type Page } from "@playwright/test";

export const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
export const API_URL = process.env.E2E_API_URL ?? "http://127.0.0.1:8000/api";

export function newStudentCredentials() {
  return {
    name: "Học viên E2E",
    email: `e2e.student.${Date.now()}.${Math.floor(Math.random() * 1000)}@mindnova.test`,
    password: "Test@12345",
  };
}

/** Registers a student through the UI and returns once the app has redirected. */
export async function registerStudent(page: Page, creds = newStudentCredentials()) {
  await page.goto("/login?mode=register");
  const form = page.locator("form").filter({ has: page.getByLabel("Xác nhận mật khẩu") });
  await form.getByLabel("Họ và tên").fill(creds.name);
  await form.getByLabel("Email").fill(creds.email);
  await form.getByLabel("Mật khẩu", { exact: true }).fill(creds.password);
  await form.getByLabel("Xác nhận mật khẩu").fill(creds.password);
  await form.getByRole("button", { name: "Đăng ký" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
  return creds;
}

/** First free, published course from the public catalog. */
export async function findFreeCourseId(page: Page): Promise<number> {
  const res = await page.request.get(`${API_URL}/student/courses/available`);
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  const courses: Array<{ id: number; current_price?: number; price?: string | number }> = Array.isArray(body) ? body : body.data ?? [];
  const free = courses.find((c) => Number(c.current_price ?? c.price ?? 0) === 0);
  if (!free) throw new Error("E2E requires at least one published free course in the catalog.");
  return free.id;
}

export async function accessToken(page: Page): Promise<string> {
  const token = await page.evaluate(() => window.localStorage.getItem("accessToken"));
  if (!token) throw new Error("No access token in localStorage");
  return token;
}
