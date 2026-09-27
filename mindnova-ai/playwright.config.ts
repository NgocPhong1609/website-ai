import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for the student flows.
 * Requires the Next.js app (E2E_BASE_URL, default http://localhost:3000) and the
 * Laravel API (E2E_API_URL, default http://127.0.0.1:8000/api) to be running with seeded data.
 * Tests register throwaway accounts named e2e.student.*@mindnova.test.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    locale: "vi-VN",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
