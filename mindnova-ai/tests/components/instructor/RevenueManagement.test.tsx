import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RevenueContainer } from "@/src/components/page/instructor/revenue/RevenueContainer";
import { SalesReportContainer } from "@/src/components/page/instructor/revenue/SalesReportContainer";
import { TransactionHistoryContainer } from "@/src/components/page/instructor/revenue/TransactionHistoryContainer";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor/revenue",
}));

describe("Instructor Revenue Suite UI/UX Standardization (Rule #7)", () => {
  it("renders RevenueContainer without duplicate topbar and opens WithdrawalModal", () => {
    render(<RevenueContainer />);

    // Check title & Vietnamese localization
    expect(screen.getByText("Quản lý Doanh thu & Tài chính")).toBeInTheDocument();
    expect(screen.getByText("Số Dư Khả Dụng Ngay")).toBeInTheDocument();
    expect(screen.getByText("Quỹ Bảo Lãnh (Escrow)")).toBeInTheDocument();

    // Verify navigation tabs
    expect(screen.getByText(/Tổng quan Doanh thu/i)).toBeInTheDocument();
    expect(screen.getByText(/Báo cáo Bán hàng/i)).toBeInTheDocument();

    // Verify modal is closed initially, open upon click
    expect(screen.queryByText("Yêu Cầu Rút Tiền Hoa Hồng")).not.toBeInTheDocument();

    const openModalBtn = screen.getByText("Yêu cầu Rút tiền").closest("button")!;
    fireEvent.click(openModalBtn);

    expect(screen.getByText("Yêu Cầu Rút Tiền Hoa Hồng")).toBeInTheDocument();
    expect(screen.getByText("Đã qua kỳ hoàn hạn 30 ngày")).toBeInTheDocument();
  });

  it("renders SalesReportContainer with standardized cards and marketing sources", () => {
    render(<SalesReportContainer />);

    expect(screen.getByText("Báo cáo Bán hàng & Chuyển đổi")).toBeInTheDocument();
    expect(screen.getByText("Doanh Thu Ròng")).toBeInTheDocument();
    expect(screen.getByText("Facebook Ads")).toBeInTheDocument();
    expect(screen.getByText("Google Search")).toBeInTheDocument();
    expect(screen.getByText(/AI Tracking 100% chính xác/i)).toBeInTheDocument();
  });

  it("renders TransactionHistoryContainer with functioning interactive filter buttons", () => {
    render(<TransactionHistoryContainer />);

    expect(screen.getByText("Lịch Sử Giao Dịch & Đối Soát")).toBeInTheDocument();

    // Check all transactions are present by default
    expect(screen.getByText(/#TXN-90231/i)).toBeInTheDocument();
    expect(screen.getByText(/#TXN-88142/i)).toBeInTheDocument(); // out transaction
    expect(screen.getByText(/#TXN-87002/i)).toBeInTheDocument(); // pending transaction

    // Filter by 'Tiền vào (Doanh thu)'
    const inFilterBtn = screen.getByText("Tiền vào (Doanh thu)");
    fireEvent.click(inFilterBtn);

    // After filtering 'in', the 'out' (#TXN-88142) and 'pending' (#TXN-87002) should be excluded
    expect(screen.getByText(/#TXN-90231/i)).toBeInTheDocument();
    expect(screen.queryByText(/#TXN-88142/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/#TXN-87002/i)).not.toBeInTheDocument();

    // Switch to 'Đang cấn trừ Escrow'
    const pendingBtn = screen.getByText("Đang cấn trừ Escrow");
    fireEvent.click(pendingBtn);
    expect(screen.getByText(/#TXN-87002/i)).toBeInTheDocument();
  });
});
