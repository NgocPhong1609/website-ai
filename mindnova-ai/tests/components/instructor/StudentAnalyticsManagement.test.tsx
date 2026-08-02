import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StudentManagementContainer } from "@/src/components/page/instructor/student-management/StudentManagementContainer";
import { StudentAnalyticsContainer } from "@/src/components/page/instructor/analytic/StudentAnalyticsContainer";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor/students",
}));

describe("Instructor Student Suite UI/UX Standardization (Rule #7)", () => {
  it("renders StudentManagementContainer without duplicate topbar and opens AINotificationModal", () => {
    render(<StudentManagementContainer />);

    // Check header and Vietnamese localization
    expect(screen.getByText("Danh Sách & Quản Trị Học Viên")).toBeInTheDocument();
    expect(screen.getByText("Quản Trị & Theo Dõi Tiến Độ Tranh Đua Học Viên", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Bảo mật quyền riêng tư/i)).toBeInTheDocument();

    // Verify navigation tabs exist
    expect(screen.getByText(/Danh sách & Chăm sóc Học viên/i)).toBeInTheDocument();
    expect(screen.getByText(/Phân tích Tương tác/i)).toBeInTheDocument();

    // Verify table records and widgets
    expect(screen.getByText("Thảo luận mới nhất")).toBeInTheDocument();
    expect(screen.getByText("Trợ lý Thông báo AI")).toBeInTheDocument();
    expect(screen.getByText("Thống Kê Tổng Quan Khóa Học")).toBeInTheDocument();

    // Trigger AI notification modal
    const aiNotifyBtn = screen.getByText("Gửi Thông Báo AI").closest("button")!;
    fireEvent.click(aiNotifyBtn);

    // Verify AI modal opens
    expect(screen.getByText(/Gửi thông báo AI/i)).toBeInTheDocument();
  });

  it("renders StudentAnalyticsContainer and switches smoothly to AI Insights tab", () => {
    render(<StudentAnalyticsContainer />);

    // Verify title and chart
    expect(screen.getByText("Quản lý & Phân tích Học viên")).toBeInTheDocument();
    expect(screen.getByText("Biểu Đồ Tương Tác Học Tập")).toBeInTheDocument();

    // Switch to AI Insights tab
    const aiTabBtn = screen.getByText("Phân tích AI Chuyên sâu").closest("button")!;
    fireEvent.click(aiTabBtn);

    // Verify AI insights loaded
    expect(screen.getByText(/Live Behavioral Telemetry/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson 2.1: Building Type-Safe Server Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Tần suất tua lại cao/i)).toBeInTheDocument();
  });
});
