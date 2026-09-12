import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "../../lib/admin-api";
import type { AdminAiSystemData } from "../../ai-system/types";
import { AdminAiSystemPage } from "../AdminAiSystemPage";

vi.mock("../../lib/admin-api", () => ({ adminApi: vi.fn() }));

function fixture(): AdminAiSystemData {
  const unavailable = { available: false, source: "unavailable" as const, coverage: "unavailable" as const, sourced_requests: 0, recorded_requests: 0 };
  return {
    providers: {
      primary: { name: "gemini", model: "gemini-2.0-flash", configured: true },
      backup: { name: "openai", model: "gpt-4o-mini", configured: false },
    },
    usage: {
      period: "7d", available: true, from: "2026-09-03", to: "2026-09-09", coverage: "recorded_requests",
      requests: { total: 0, successful: 0, failed: 0, status_unavailable: 0 },
      tokens: { ...unavailable, input: null, output: null },
      cost: { ...unavailable, amount: null, currency: null },
      daily_trend: [], provider_breakdown: [],
    },
    packages: { free: { daily_requests: 30, daily_tokens: null }, premium: { daily_requests: 200, daily_tokens: null } },
    prompts: { ai_tro_giang: "Hướng dẫn học sinh", ai_cham_bai: "Chấm bài công bằng" },
    updated_at: null,
  };
}

beforeEach(() => { vi.mocked(adminApi).mockReset(); vi.mocked(adminApi).mockResolvedValue(fixture()); });
afterEach(cleanup);

async function loaded() {
  render(<AdminAiSystemPage />);
  await screen.findByLabelText("Free · Yêu cầu / ngày");
}

describe("AdminAiSystemPage", () => {
  it("shows an accessible loading skeleton while fetching", () => {
    vi.mocked(adminApi).mockReturnValue(new Promise(() => {}));
    render(<AdminAiSystemPage />);
    expect(screen.getByRole("status")).toHaveTextContent(/Đang tải/);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("shows fetch errors and retries successfully", async () => {
    vi.mocked(adminApi).mockRejectedValueOnce(new Error("Mất kết nối"));
    render(<AdminAiSystemPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Mất kết nối");
    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(await screen.findByLabelText("Free · Yêu cầu / ngày")).toHaveValue(30);
  });

  it("shows real zero requests, unavailable metrics, and explicit empty trends", async () => {
    await loaded();
    expect(within(screen.getByRole("region", { name: "Yêu cầu đã ghi nhận" })).getByText("0")).toBeVisible();
    expect(within(screen.getByRole("region", { name: "Chi phí" })).getByText("Chưa có dữ liệu")).toBeVisible();
    expect(screen.getByText("Chưa có yêu cầu được ghi nhận trong kỳ này.")).toBeVisible();
    expect(screen.getByText(/Chỉ bao gồm các yêu cầu đã được ghi nhận/)).toBeVisible();
  });

  it("shows readiness without secret fragments or writable providers", async () => {
    const data = fixture();
    Object.assign(data.providers.primary, { api_key: "sk-secret-sentinel", apiKeyHint: "sk-...last4" });
    vi.mocked(adminApi).mockResolvedValue(data);
    await loaded();
    expect(within(screen.getByRole("region", { name: "AI chính" })).getByText("Đã cấu hình")).toBeVisible();
    expect(within(screen.getByRole("region", { name: "AI dự phòng" })).getByText("Chưa cấu hình")).toBeVisible();
    expect(screen.queryByText(/sk-secret|last4/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Provider chính")).not.toBeInTheDocument();
  });

  it("restores saved package and prompt values on Cancel", async () => {
    await loaded();
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "60" } });
    fireEvent.change(screen.getByLabelText("AI Trợ giảng"), { target: { value: "Nội dung mới" } });
    expect(screen.getByText("Có thay đổi chưa lưu.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hủy thay đổi" }));
    expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(30);
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveValue("Hướng dẫn học sinh");
    expect(screen.getByRole("button", { name: "Lưu cấu hình" })).toBeDisabled();
  });

  it("blocks invalid package and prompt writes with associated errors", async () => {
    await loaded();
    fireEvent.change(screen.getByLabelText("Premium · Yêu cầu / ngày"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("AI Trợ giảng"), { target: { value: " " } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cấu hình" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/Kiểm tra/);
    expect(screen.queryByRole("button", { name: "Thử lại" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Premium · Yêu cầu / ngày")).toHaveFocus();
    expect(screen.getByLabelText("Premium · Yêu cầu / ngày")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveAccessibleDescription(/Nội dung bắt buộc/);
    expect(vi.mocked(adminApi).mock.calls.some(([, options]) => options?.method === "PUT")).toBe(false);
  });

  it("sends only writable settings and reloads canonical data after saving", async () => {
    await loaded();
    const refreshed = fixture();
    refreshed.packages.free.daily_requests = 61;
    vi.mocked(adminApi).mockResolvedValueOnce({ message: "Saved" }).mockResolvedValueOnce(refreshed);
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "60" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cấu hình" }));
    await waitFor(() => expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(61));
    expect(screen.getByRole("status")).toHaveTextContent(/Đã lưu/);
    const write = vi.mocked(adminApi).mock.calls.find(([, options]) => options?.method === "PUT");
    expect(write?.[0]).toBe("/admin/ai-config");
    expect(JSON.parse(String(write?.[1]?.body))).toEqual({
      packages: { free: { daily_requests: 60, daily_tokens: null }, premium: { daily_requests: 200, daily_tokens: null } },
      prompts: { ai_tro_giang: "Hướng dẫn học sinh", ai_cham_bai: "Chấm bài công bằng" },
    });
  });

  it("preserves edits and shows an error when saving fails", async () => {
    await loaded();
    vi.mocked(adminApi).mockRejectedValueOnce(new Error("Không thể lưu"));
    fireEvent.change(screen.getByLabelText("AI Trợ giảng"), { target: { value: "Giải thích từng bước" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cấu hình" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Không thể lưu");
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveValue("Giải thích từng bước");
    expect(screen.getByRole("button", { name: "Lưu cấu hình" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Thử lại" })).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/Thay đổi của bạn vẫn được giữ/);
    const refreshed = fixture();
    refreshed.prompts.ai_tro_giang = "Giải thích từng bước";
    vi.mocked(adminApi).mockResolvedValueOnce({ message: "Saved" }).mockResolvedValueOnce(refreshed);
    fireEvent.click(screen.getByRole("button", { name: "Lưu lại" }));
    await screen.findByText("Đã lưu cấu hình AI.");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveValue("Giải thích từng bước");
    expect(vi.mocked(adminApi).mock.calls.map(([, options]) => options?.method ?? "GET")).toEqual(["GET", "PUT", "PUT", "GET"]);
  });

  it.each([null, 42, false, { nested: "invalid" }])("renders usable canonical prompt defaults for a legacy %j response", async (legacy) => {
    const data = fixture();
    Object.assign(data.prompts, { ai_tro_giang: legacy, ai_cham_bai: legacy });
    vi.mocked(adminApi).mockResolvedValueOnce(data);
    await loaded();
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveValue("Ban la AI tro giang, tra loi ngan gon, de hieu, uu tien tieng Viet.");
    expect(screen.getByLabelText("AI Chấm bài")).toHaveValue("Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.");
    expect(screen.getByLabelText("AI Trợ giảng")).toHaveAccessibleDescription(/67\/4000/);
    fireEvent.change(screen.getByLabelText("AI Chấm bài"), { target: { value: "Updated grading prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Hủy thay đổi" }));
    expect(screen.getByLabelText("AI Chấm bài")).toHaveValue("Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.");
    expect(screen.getByRole("button", { name: "Lưu cấu hình" })).toBeDisabled();
  });

  it("offers reload when the canonical fetch after a successful save fails", async () => {
    await loaded();
    vi.mocked(adminApi).mockResolvedValueOnce({ message: "Saved" }).mockRejectedValueOnce(new Error("Tải lại thất bại"));
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "80" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cấu hình" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Tải lại thất bại");
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Lưu lại" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(80);
  });

  it("asks before refresh replaces dirty edits and supports keeping or discarding them", async () => {
    await loaded();
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "80" } });
    act(() => { window.dispatchEvent(new Event("admin:refresh-data")); });
    expect(screen.getByRole("alertdialog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Tiếp tục chỉnh sửa" }));
    expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(80);
    expect(adminApi).toHaveBeenCalledTimes(1);
    act(() => { window.dispatchEvent(new Event("admin:refresh-data")); });
    fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi và tải lại" }));
    await waitFor(() => expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(30));
  });

  it("loads the selected period without silently discarding dirty edits", async () => {
    await loaded();
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText("Khoảng thời gian"), { target: { value: "30d" } });
    expect(screen.getByRole("alertdialog")).toBeVisible();
    const next = fixture(); next.usage.period = "30d";
    vi.mocked(adminApi).mockResolvedValueOnce(next);
    fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi và tải lại" }));
    await waitFor(() => expect(screen.getByLabelText("Khoảng thời gian")).toHaveValue("30d"));
    expect(adminApi).toHaveBeenLastCalledWith("/admin/ai-config?period=30d");
  });

  it("renders sourced zero cost and discloses partial estimated token coverage", async () => {
    const data = fixture();
    data.usage.tokens = { input: 120, output: 45, available: true, source: "estimated", coverage: "partial", sourced_requests: 1, recorded_requests: 3 };
    data.usage.cost = { amount: 0, currency: "USD", available: true, source: "provider", coverage: "complete", sourced_requests: 3, recorded_requests: 3 };
    vi.mocked(adminApi).mockResolvedValue(data);
    await loaded();
    expect(within(screen.getByRole("region", { name: "Chi phí" })).getByText("0.0000 USD")).toBeVisible();
    expect(within(screen.getByRole("region", { name: "Token đầu vào" })).getByText("120")).toBeVisible();
    expect(within(screen.getByRole("region", { name: "Token đầu vào" })).getByText(/Ước tính · 1\/3 yêu cầu/)).toBeVisible();
    expect(screen.getByText(/Đã lưu · Chưa áp dụng vào luồng chấm bài/)).toBeVisible();
  });

  it("renders a real trend and provider/model request breakdown", async () => {
    const data = fixture();
    data.usage.requests = { total: 3, successful: 2, failed: 1, status_unavailable: 0 };
    data.usage.daily_trend = [{ date: "2026-09-08", requests: 1 }, { date: "2026-09-09", requests: 2 }];
    data.usage.provider_breakdown = [{ provider: "gemini", model: "gemini-2.0-flash", requests: 3 }];
    vi.mocked(adminApi).mockResolvedValue(data);
    await loaded();
    expect(screen.getByRole("img", { name: /Biểu đồ 3 yêu cầu/ })).toBeVisible();
    expect(within(screen.getByRole("region", { name: "Sử dụng theo nhà cung cấp" })).getByText("3 yêu cầu")).toBeVisible();
    expect(screen.queryByText("Chưa có yêu cầu được ghi nhận trong kỳ này.")).not.toBeInTheDocument();
  });

  it("does not draw a chart for backend zero-filled empty days", async () => {
    const data = fixture();
    data.usage.daily_trend = [{ date: "2026-09-08", requests: 0 }, { date: "2026-09-09", requests: 0 }];
    vi.mocked(adminApi).mockResolvedValue(data);
    await loaded();
    expect(screen.queryByRole("img", { name: /Biểu đồ/ })).not.toBeInTheDocument();
    expect(screen.getByText("Chưa có yêu cầu được ghi nhận trong kỳ này.")).toBeVisible();
  });

  it("persists a cleared optional token limit as null", async () => {
    const data = fixture(); data.packages.free.daily_tokens = 500;
    vi.mocked(adminApi).mockResolvedValueOnce(data);
    await loaded();
    fireEvent.change(screen.getByLabelText("Free · Token / ngày"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cấu hình" }));
    await screen.findByText("Đã lưu cấu hình AI.");
    const write = vi.mocked(adminApi).mock.calls.find(([, options]) => options?.method === "PUT");
    expect(JSON.parse(String(write?.[1]?.body)).packages.free.daily_tokens).toBeNull();
  });

  it("keeps the draft if an approved refresh fails", async () => {
    await loaded();
    fireEvent.change(screen.getByLabelText("Free · Yêu cầu / ngày"), { target: { value: "80" } });
    vi.mocked(adminApi).mockRejectedValueOnce(new Error("Tải lại thất bại"));
    act(() => { window.dispatchEvent(new Event("admin:refresh-data")); });
    fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi và tải lại" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Tải lại thất bại");
    expect(screen.getByLabelText("Free · Yêu cầu / ngày")).toHaveValue(80);
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeEnabled();
  });
});
