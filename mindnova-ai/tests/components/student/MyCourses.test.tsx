import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StudentCoursesContainer } from "@/src/components/page/student/courses/StudentCoursesContainer";

// Mock Next image & link
vi.mock("next/image", () => ({
  default: ({ fill, ...props }: any) => <img {...props} data-fill={fill?.toString()} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Student My Courses Page (UI/UX Rule #7) Suite", () => {
  it("renders StudentCoursesContainer with Vietnamese header, AI mentor banner and course cards", () => {
    render(<StudentCoursesContainer />);

    expect(screen.getByText("Khóa học của tôi")).toBeInTheDocument();
    expect(screen.getByText(/Trợ lý AI Tối ưu Lộ trình Học tập/i)).toBeInTheDocument();
    expect(screen.getByText(/Node.js Microservices & LLM Backend/i)).toBeInTheDocument();
    expect(screen.getByText(/Khám Phá Khóa Học Mới/i)).toBeInTheDocument();
  });

  it("filters course list when selecting 'Đã hoàn thành' tab", () => {
    render(<StudentCoursesContainer />);

    const completedTab = screen.getByText(/Đã hoàn thành \(1\)/i);
    fireEvent.click(completedTab);

    expect(screen.getByText(/JavaScript Advanced/i)).toBeInTheDocument();
    expect(screen.queryByText(/Node.js Microservices/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/React Query/i)).not.toBeInTheDocument();
  });

  it("filters course list by search query", () => {
    render(<StudentCoursesContainer />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm khóa học/i);
    fireEvent.change(searchInput, { target: { value: "Trần Anh Quân" } });

    expect(screen.getByText(/React Query/i)).toBeInTheDocument();
    expect(screen.queryByText(/Node.js Microservices/i)).not.toBeInTheDocument();
  });

  it("dismisses AI mentor notification when clicking Đã hiểu", () => {
    render(<StudentCoursesContainer />);

    const dismissBtn = screen.getByText(/Đã hiểu ✕/i);
    fireEvent.click(dismissBtn);

    expect(screen.queryByText(/Trợ lý AI Tối ưu Lộ trình Học tập/i)).not.toBeInTheDocument();
  });
});
