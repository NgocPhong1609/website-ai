import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminPage from "@/app/admin/page";
import AdminAnalyticsRoute from "@/app/admin/analytics/page";
import { apiClient } from "@/src/shared/lib";
import type { AdminOverviewData } from "../../types";
import { AdminOverviewPage } from "../AdminOverviewPage";

vi.mock("@/src/shared/lib", () => ({ apiClient: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("../../lib/admin-api", () => ({ adminApi: () => new Promise(() => {}) }));

function fixture(): AdminOverviewData {
  return {
    hero: { title: "Xin chào, Quản trị viên", description: "Tổng quan quản trị", primaryAction: "Quản lý nội dung", secondaryAction: "Xem báo cáo" },
    stats: [{ label: "Tổng người dùng", value: "37", trend: "+2%", note: "so với 30 ngày trước" }],
    activities: [{ label: "Mon", value: 3 }, { label: "Tue", value: 8 }],
    health: [], users: [], quickActions: [],
  };
}

beforeEach(() => { vi.mocked(apiClient).mockReset(); vi.mocked(apiClient).mockResolvedValue(fixture()); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("mounts Overview at /admin without the AI & System summary", async () => {
  render(await AdminPage());
  expect(screen.getByRole("heading", { name: "Xin chào, Quản trị viên" })).toBeVisible();
  expect(screen.getAllByText("37").length).toBeGreaterThan(0);
  expect(screen.queryByText("Báo cáo tài chính, học tập và hệ thống")).not.toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Tổng quan AI" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Cấu hình AI & Hệ thống" })).not.toBeInTheDocument();
});

it("keeps the dedicated analytics route available", () => {
  render(<AdminAnalyticsRoute />);
  expect(screen.getByRole("heading", { name: "Báo cáo tài chính, học tập và hệ thống" })).toBeVisible();
  expect(screen.queryByRole("region", { name: "Tổng quan AI" })).not.toBeInTheDocument();
});

it("renders recorded activity values on the TeacherColor activity chart", async () => {
  render(await AdminOverviewPage());
  expect(screen.getByRole("heading", { name: "Biểu đồ hoạt động" })).toBeVisible();
  expect(screen.getAllByText("Mon").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Tue").length).toBeGreaterThan(0);
  expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  expect(screen.getAllByText("8").length).toBeGreaterThan(0);
});

it("renders a fully shaped unavailable state when Overview cannot be fetched", async () => {
  vi.mocked(apiClient).mockRejectedValue(new Error("Network unavailable"));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  render(await AdminOverviewPage());
  expect(screen.getByRole("alert")).toHaveTextContent("Không thể tải tổng quan");
  expect(screen.getByText("Chưa có dữ liệu hoạt động.")).toBeVisible();
  expect(screen.queryByText("Chưa có dữ liệu AI.")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Cấu hình AI & Hệ thống" })).not.toBeInTheDocument();
});
