import { cleanup, render, screen, within } from "@testing-library/react";
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
  const unavailable = { available: false, source: "unavailable" as const, coverage: "unavailable" as const, sourced_requests: 0, recorded_requests: 0 };
  return {
    hero: { title: "Xin chào, Quản trị viên", description: "Tổng quan quản trị", primaryAction: "Quản lý nội dung", secondaryAction: "Xem báo cáo" },
    stats: [{ label: "Tổng người dùng", value: "37", trend: "+2%", note: "so với 30 ngày trước" }],
    activities: [{ label: "Mon", value: 3 }, { label: "Tue", value: 8 }],
    health: [], users: [], quickActions: [],
    ai_summary: {
      packages: { free: { daily_requests: 42, daily_tokens: null }, premium: { daily_requests: 600, daily_tokens: 9000 } },
      providers: {
        primary: { name: "gemini", model: "gemini-test", configured: true },
        backup: { name: "openai", model: "backup-test", configured: false },
      },
      usage: {
        period: "7d", available: true, from: "2026-09-03", to: "2026-09-09", coverage: "recorded_requests",
        requests: { total: 0, successful: 0, failed: 0, status_unavailable: 0 },
        tokens: { ...unavailable, input: null, output: null },
        cost: { ...unavailable, amount: null, currency: null },
        daily_trend: [], provider_breakdown: [],
      },
    },
  };
}

beforeEach(() => { vi.mocked(apiClient).mockReset(); vi.mocked(apiClient).mockResolvedValue(fixture()); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("mounts Overview at /admin with the final read-only AI summary and configuration link", async () => {
  const { container } = render(await AdminPage());
  expect(screen.getByRole("heading", { name: "Xin chào, Quản trị viên" })).toBeVisible();
  expect(screen.getAllByText("37").length).toBeGreaterThan(0);
  expect(screen.queryByText("Báo cáo tài chính, học tập và hệ thống")).not.toBeInTheDocument();
  const summary = screen.getByRole("region", { name: "Tổng quan AI" });
  expect(container.firstElementChild?.lastElementChild).toBe(summary);
  expect(within(summary).getByRole("link", { name: "Cấu hình AI & Hệ thống" })).toHaveAttribute("href", "/admin/ai-system");
  expect(within(summary).queryByRole("textbox")).not.toBeInTheDocument();
  expect(within(summary).queryByRole("button")).not.toBeInTheDocument();
  expect(within(summary).queryByRole("spinbutton")).not.toBeInTheDocument();
  const limits = within(summary).getByRole("region", { name: "Hạn mức AI Trợ giảng" });
  expect(within(limits).getByText("Free")).toBeVisible();
  expect(within(limits).getByText("42 yêu cầu / ngày")).toBeVisible();
  expect(within(limits).getByText("Premium")).toBeVisible();
  expect(within(limits).getByText("600 yêu cầu / ngày")).toBeVisible();
});

it("shows configured providers, true zero requests and unavailable token/cost values", async () => {
  render(await AdminOverviewPage());
  expect(within(screen.getByRole("region", { name: "AI chính" })).getByText("Đã cấu hình")).toBeVisible();
  expect(within(screen.getByRole("region", { name: "AI dự phòng" })).getByText("Chưa cấu hình")).toBeVisible();
  expect(within(screen.getByRole("region", { name: "Yêu cầu đã ghi nhận" })).getByText("0")).toBeVisible();
  expect(within(screen.getByRole("region", { name: "Token đầu vào" })).getByText("Chưa có dữ liệu")).toBeVisible();
  expect(within(screen.getByRole("region", { name: "Chi phí" })).getByText("Chưa có dữ liệu")).toBeVisible();
});

it("shows measured usage and its provenance in the compact summary", async () => {
  const data = fixture();
  data.ai_summary!.usage = {
    ...data.ai_summary!.usage,
    requests: { total: 9, successful: 7, failed: 1, status_unavailable: 1 },
    tokens: { available: true, input: 120, output: 80, source: "estimated", coverage: "partial", sourced_requests: 7, recorded_requests: 9 },
    cost: { available: true, amount: 0, currency: "USD", source: "provider", coverage: "complete", sourced_requests: 9, recorded_requests: 9 },
  };
  vi.mocked(apiClient).mockResolvedValue(data);
  render(await AdminOverviewPage());
  expect(within(screen.getByRole("region", { name: "Yêu cầu đã ghi nhận" })).getByText("9")).toBeVisible();
  const tokens = screen.getByRole("region", { name: "Token đầu vào" });
  expect(within(tokens).getByText("120")).toBeVisible();
  expect(within(tokens).getByText(/Ước tính.*7\/9.*Dữ liệu một phần/)).toBeVisible();
  expect(within(screen.getByRole("region", { name: "Chi phí" })).getByText("0.0000 USD")).toBeVisible();
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
  expect(screen.getByText("Chưa có dữ liệu AI.")).toBeVisible();
  expect(screen.getByRole("link", { name: "Cấu hình AI & Hệ thống" })).toHaveAttribute("href", "/admin/ai-system");
  expect(screen.queryByText("Đã cấu hình")).not.toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Hạn mức AI Trợ giảng" })).not.toBeInTheDocument();
});
