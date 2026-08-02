import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EditCourseContainer } from "@/src/components/page/instructor/edit-course";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor/courses/c1/edit",
}));

describe("Instructor Edit Course Studio UI/UX Suite", () => {
  it("renders overview & SEO tab by default with title and status controls", () => {
    render(<EditCourseContainer courseId="test-101" />);

    expect(screen.getByText(/Chỉnh sửa khóa học #test-101/i)).toBeInTheDocument();
    expect(screen.getByText("Thông tin cơ bản khóa học")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();

    // AI Optimization trigger
    const aiBtn = screen.getByText("AI Tối ưu hóa");
    fireEvent.click(aiBtn);
    expect(screen.getByText(/Agentic Workflow/i)).toBeInTheDocument();
  });

  it("switches to Curriculum & AI Content tab and displays lesson studio link", () => {
    render(<EditCourseContainer courseId="test-101" />);

    const curriculumTab = screen.getByText("Chương trình & Nội dung AI");
    fireEvent.click(curriculumTab);

    expect(screen.getByText("Trung tâm Điều hành Chương bài & Video")).toBeInTheDocument();
    const studioLink = screen.getByText(/Mở Studio Quản Lý Bài Giảng & Video/i).closest("a");
    expect(studioLink).toHaveAttribute("href", "/instructor/courses/test-101/lessons");
  });

  it("switches to Pricing tab and calculates 80% instructor revenue share correctly", () => {
    render(<EditCourseContainer courseId="test-101" />);

    const pricingTab = screen.getByText("Giá bán & Khuyến mãi");
    fireEvent.click(pricingTab);

    expect(screen.getByText("Cấu hình Giá bán & Doanh thu")).toBeInTheDocument();
    expect(screen.getByText(/Tỷ lệ phân chia Giảng viên/i)).toBeInTheDocument();
    expect(screen.getByText("80.0%")).toBeInTheDocument();
  });

  it("simulates Saving Changes workflow with success state transition", () => {
    vi.useFakeTimers();
    render(<EditCourseContainer courseId="test-101" />);

    const saveBtn = screen.getByText("Lưu & Cập nhật").closest("button")!;
    fireEvent.click(saveBtn);

    expect(screen.getByText("⏳ Đang lưu...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText("Đã lưu thay đổi")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
