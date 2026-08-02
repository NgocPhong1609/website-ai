import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StudentProgressContainer } from "@/src/components/page/student/progress/ProgressContent";

// Mock Next image & link
vi.mock("next/image", () => ({
  default: ({ fill, ...props }: any) => <img {...props} data-fill={fill?.toString()} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Student Learning Progress Page (UI/UX Rule #7) Suite", () => {
  it("renders StudentProgressContainer with Vietnamese headers, stat cards and linear roadmap by default", () => {
    render(<StudentProgressContainer />);

    expect(screen.getByText(/Tiến độ Học thuật & Kỹ năng/i)).toBeInTheDocument();
    expect(screen.getByText(/Tổng Thời Gian Học/i)).toBeInTheDocument();
    expect(screen.getByText(/Điểm Kiểm Tra Trung Bình/i)).toBeInTheDocument();
    expect(screen.getByText(/Kỹ Năng Đã Làm Chủ/i)).toBeInTheDocument();

    // Check Linear Timeline rendering
    expect(screen.getByText(/Module 1: Nhập môn Kiến trúc Next.js 16 & App Router/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ôn Bài/i).length).toBeGreaterThan(0);
  });

  it("switches to 'Cụm chuyên đề (Modules)' view mode when clicking toggle button", () => {
    render(<StudentProgressContainer />);

    const moduleViewBtn = screen.getByText(/📦 Cụm chuyên đề \(Modules\)/i);
    fireEvent.click(moduleViewBtn);

    expect(screen.getByText(/Nắm vững luồng phân phối tải/i)).toBeInTheDocument();
    expect(screen.getByText(/Tiếp tục chuyên đề/i)).toBeInTheDocument();
    expect(screen.getByText(/Quản lý luồng dữ liệu thời gian thực/i)).toBeInTheDocument();
  });

  it("displays Nova AI Tutor analysis widget and study streak information", () => {
    render(<StudentProgressContainer />);

    expect(screen.getByText(/Trợ Lý AI Phân Tích/i)).toBeInTheDocument();
    expect(screen.getByText(/Trọng Điểm Cần Chú Ý/i)).toBeInTheDocument();
    expect(screen.getByText(/Thử Thách Kế Tiếp/i)).toBeInTheDocument();
    expect(screen.getByText(/Chuỗi ngày học liên tục/i)).toBeInTheDocument();
  });
});
