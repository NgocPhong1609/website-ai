import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/src/shared/lib/axios";
import { Step3SettingsPrice } from "../Step3SettingsPrice";

vi.mock("@/src/shared/lib/axios", () => ({
  axiosClient: { get: vi.fn() },
}));

beforeEach(() => {
  vi.mocked(axiosClient.get).mockReset();
  sessionStorage.clear();
});
afterEach(cleanup);

describe("Step3SettingsPrice commission tiers", () => {
  it("renders labels and allocation percentages returned by the API", async () => {
    vi.mocked(axiosClient.get).mockResolvedValue({
      data: {
        data: [
          { tier: "standard", label: "Standard API", platform_commission_percent: 22, instructor_percent: 78 },
          { tier: "exclusive", label: "Exclusive API", platform_commission_percent: 9, instructor_percent: 91 },
        ],
      },
    });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <Step3SettingsPrice initialPrice={100000} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("button", { name: /Standard API.*22%.*78%/ })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Exclusive API.*9%.*91%/ }));

    expect(screen.getByText("Phí Hạ Tầng Nền Tảng (9%):")).toBeVisible();
    expect(screen.getByText("91%", { selector: "span" })).toBeVisible();
  });

  it("shows an explicit failure state without hiding tier selection", async () => {
    vi.mocked(axiosClient.get).mockRejectedValue(new Error("offline"));
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <Step3SettingsPrice initialPrice={100000} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Không thể tải tỷ lệ hoa hồng");
    expect(screen.getByRole("button", { name: "standard" })).toBeVisible();
    expect(screen.getByRole("button", { name: "exclusive" })).toBeVisible();
    expect(screen.queryByText(/30% phí hệ thống|15% phí/)).not.toBeInTheDocument();
  });
});
