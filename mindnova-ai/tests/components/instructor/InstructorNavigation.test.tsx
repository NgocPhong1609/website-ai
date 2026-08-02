import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InstructorSidebar, InstructorTopbar } from "@/src/components/page/instructor/management";
import { SidebarProvider } from "@/src/components/ui";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor",
}));

describe("Instructor Navigation & Alert Center UI/UX Suite", () => {
  it("renders InstructorSidebar with streamlined active core features (no redundant options)", () => {
    render(
      <SidebarProvider>
        <InstructorSidebar />
      </SidebarProvider>
    );

    expect(screen.getAllByText("QUẢN LÝ & GIẢNG DẠY").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Quản lý Khóa học").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tạo Khóa Học AI").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Thảo luận & Hỏi đáp").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Phân tích Học viên").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Quản lý Doanh thu").length).toBeGreaterThan(0);

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Support")).not.toBeInTheDocument();
  });

  it("renders InstructorTopbar inside SidebarProvider and toggles interactive alert dropdown cleanly", () => {
    render(
      <SidebarProvider>
        <InstructorTopbar />
      </SidebarProvider>
    );

    expect(screen.getByText("MindNova Instructor")).toBeInTheDocument();
    expect(screen.getByText("PRO")).toBeInTheDocument();

    const alertBtn = screen.getByLabelText("Toggle Alert Center");
    expect(alertBtn).toBeInTheDocument();

    fireEvent.click(alertBtn);
    expect(screen.getByText("Thông báo Giảng viên")).toBeInTheDocument();
    expect(screen.getByText(/Thảo luận cần phản hồi/i)).toBeInTheDocument();

    const markReadBtn = screen.getByText("Đọc tất cả");
    expect(markReadBtn).toBeInTheDocument();

    fireEvent.click(markReadBtn);
    expect(screen.queryByText("Đọc tất cả")).not.toBeInTheDocument();
  });

  it("allows dismissing an individual notification in the Topbar alert dropdown", () => {
    render(
      <SidebarProvider>
        <InstructorTopbar />
      </SidebarProvider>
    );

    const alertBtn = screen.getByLabelText("Toggle Alert Center");
    fireEvent.click(alertBtn);

    const alertTitle = screen.getByText("Chu kỳ thanh toán học phí hoàn tất");
    expect(alertTitle).toBeInTheDocument();

    const dismissButtons = screen.getAllByText("✕");
    expect(dismissButtons.length).toBeGreaterThan(1);
    fireEvent.click(dismissButtons[1]);

    expect(screen.queryByText("Chu kỳ thanh toán học phí hoàn tất")).not.toBeInTheDocument();
  });
});
