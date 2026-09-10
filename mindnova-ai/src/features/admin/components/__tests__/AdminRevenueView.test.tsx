import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminRevenueData } from "../../types";
import { AdminRevenueView } from "../AdminRevenueView";

const data: AdminRevenueData = {
  totalRevenue: 0,
  totalAdminRevenue: 0,
  totalTeacherRevenue: 0,
  courseCount: 0,
  courses: [],
  orderHistory: [],
  commissionTiers: [
    { tier: "standard", label: "Doi tac Tieu chuan", platform_commission_percent: 30, instructor_percent: 70 },
    { tier: "exclusive", label: "Hop tac Doc quyen MindNova", platform_commission_percent: 15, instructor_percent: 85 },
  ],
};

let fetchMock: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ data: [] }),
  } as Response);
});
afterEach(cleanup);

describe("AdminRevenueView commission tiers", () => {
  it("labels a weighted course summary as mixed instead of claiming one tier", () => {
    render(<AdminRevenueView data={{
      ...data,
      courses: [{
        courseId: 1,
        courseTitle: "Khóa học hỗn hợp",
        instructorName: "Giảng viên",
        partnershipTier: "mixed",
        grossRevenue: 200,
        adminRevenue: 45,
        teacherRevenue: 155,
        instructorPercent: 77.5,
        revenue: 200,
        students: 2,
        conversionRate: 100,
      }],
    }} />);

    expect(screen.getByText("Nhiều chế độ (GV bình quân 77.5%)")).toBeVisible();
    expect(screen.queryByText(/Đối Tác Tiêu Chuẩn \(77\.5%\)/i)).not.toBeInTheDocument();
  });

  it("saves edited platform percentages and derives the instructor share", async () => {
    render(<AdminRevenueView data={data} />);

    fireEvent.change(screen.getByLabelText("Doi tac Tieu chuan · Phí nền tảng"), { target: { value: "22" } });

    expect(screen.getByText("Giảng viên nhận 78%")) .toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Lưu tỷ lệ hoa hồng" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/admin/revenue/commission-tiers");
    expect(request.method).toBe("PUT");
    expect(JSON.parse(String(request.body))).toEqual({
        tiers: [
          { tier: "standard", platform_commission_percent: 22 },
          { tier: "exclusive", platform_commission_percent: 15 },
        ],
      });
    expect(await screen.findByRole("status")).toHaveTextContent("Đã lưu tỷ lệ hoa hồng");
  });

  it("preserves commission edits when saving fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Không thể lưu tỷ lệ" }),
    } as Response);
    render(<AdminRevenueView data={data} />);

    const input = screen.getByLabelText("Doi tac Tieu chuan · Phí nền tảng");
    fireEvent.change(input, { target: { value: "24" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu tỷ lệ hoa hồng" }));

    await waitFor(() => expect(screen.queryByRole("alert")).toHaveTextContent("Không thể lưu tỷ lệ"));
    expect(input).toHaveValue(24);
  });

  it("locks tier inputs while a save is in flight", async () => {
    let resolveSave: ((value: Response) => void) | undefined;
    fetchMock.mockImplementation(() => new Promise<Response>((resolve) => {
      resolveSave = resolve;
    }));
    render(<AdminRevenueView data={data} />);

    fireEvent.click(screen.getByRole("button", { name: "Lưu tỷ lệ hoa hồng" }));

    const input = screen.getByLabelText("Doi tac Tieu chuan · Phí nền tảng");
    expect(input).toBeDisabled();
    resolveSave?.({ ok: true, status: 200, json: async () => ({ data: [] }) } as Response);
    await waitFor(() => expect(input).toBeEnabled());
  });
});
