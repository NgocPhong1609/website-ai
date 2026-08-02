import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StudentDashboardContainer } from "@/src/components/page/student/dashboard/StudentDashboardContainer";

// Mock Next image & link
vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => (
    <img {...props} data-fill={fill?.toString()} data-priority={priority?.toString()} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Student Dashboard Page (UI/UX Rule #7) Suite", () => {
  it("renders StudentDashboardContainer with hero welcome banner, AI suggestions and sidebar stats", () => {
    render(<StudentDashboardContainer />);

    expect(screen.getByText(/Chào mừng trở lại, Học viên xuất sắc!/i)).toBeInTheDocument();
    expect(screen.getByText(/Gia Sư AI Nova Đề Xuất/i)).toBeInTheDocument();
    expect(screen.getByText(/Tiến Độ Lộ Trình Chung/i)).toBeInTheDocument();
    expect(screen.getByText(/Chuỗi Ngày Học Tích Cực/i)).toBeInTheDocument();
  });

  it("renders Continue Learning widget and allows switching filter pills", () => {
    render(<StudentDashboardContainer />);

    expect(screen.getByText(/Tiếp Tục Lộ Trình Học Tập/i)).toBeInTheDocument();

    const activeFilter = screen.getByRole("button", { name: /^Đang học$/i });
    fireEvent.click(activeFilter);

    // Verify course content transitions properly without multiple match errors
    expect(screen.getAllByText(/Tiếp tục phát video bài giảng|Không có khóa học nào/i).length).toBeGreaterThan(0);
  });

  it("displays trending courses inside Explore Courses section", () => {
    render(<StudentDashboardContainer />);

    expect(screen.getByText(/Khám Phá Học Phần & Công Nghệ Mới/i)).toBeInTheDocument();
    expect(screen.getByText(/Đang tải dữ liệu khóa học mới...|Kiến trúc RAG Agents/i)).toBeInTheDocument();
  });
});
