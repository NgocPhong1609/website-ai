import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CourseManagementContainer, AIBanner, RevenueCard, CourseCard, CreateCourseCard } from "@/src/components/page/instructor/management";
import type { Course } from "@/src/components/page/instructor/management/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor",
}));

describe("Instructor Course Management UI/UX Suite", () => {
  it("renders CourseManagementContainer with header and essential widgets", () => {
    render(<CourseManagementContainer />);
    expect(screen.getByText("Quản lý khóa học")).toBeInTheDocument();
    expect(screen.getByText(/Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn/i)).toBeInTheDocument();
  });

  it("renders AIBanner and links directly to AI Course Studio (/instructor/create-course)", () => {
    render(<AIBanner />);
    expect(screen.getByText("Hỗ trợ AI: Sinh đề cương tự động")).toBeInTheDocument();
    
    const ctaLink = screen.getByText("Thử ngay bây giờ").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/instructor/create-course");
  });

  it("renders RevenueCard with monthly data and link to detailed financial report", () => {
    render(<RevenueCard />);
    expect(screen.getByText(/Doanh thu tháng này/i)).toBeInTheDocument();
    expect(screen.getByText(/Trạng thái: Ổn định/i)).toBeInTheDocument();

    const detailsLink = screen.getByText(/Chi tiết ➔/i).closest("a");
    expect(detailsLink).toHaveAttribute("href", "/instructor/revenue");
  });

  it("renders CourseCard with title, duration, status, and correct actionable user flow links", () => {
    const mockCourse: Course = {
      id: "test-course-1",
      title: "Mastering Next.js & AI Integration",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      status: "published",
      durationHours: 12,
      totalLessons: 45,
      lastModified: "2 days ago",
      studentsCount: 120,
      completionRate: 85,
    };

    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText("Mastering Next.js & AI Integration")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText(/12 giờ/i)).toBeInTheDocument();
    expect(screen.getByText(/45 bài học/i)).toBeInTheDocument();

    const contentLink = screen.getByText("Nội dung AI").closest("a");
    expect(contentLink).toHaveAttribute("href", "/instructor/create-course");

    const revenueLink = screen.getByText("Giá & Doanh thu").closest("a");
    expect(revenueLink).toHaveAttribute("href", "/instructor/revenue");
  });

  it("renders CreateCourseCard as a clickable navigation link to AI studio", () => {
    render(<CreateCourseCard />);
    expect(screen.getByText("Tạo khóa học mới")).toBeInTheDocument();
    
    const studioLink = screen.getByRole("link", { name: /Tạo khóa học mới/i });
    expect(studioLink).toHaveAttribute("href", "/instructor/create-course");
  });
});
