import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurriculumAccordion } from "../CurriculumAccordion";

vi.mock("react-hot-toast", () => ({ default: vi.fn() }));

const modules = [
  {
    id: 1,
    title: "Chương 1",
    duration: "Nhiều bài học",
    lessons: [
      { id: "a", title: "Video Upload", type: "video", duration: "12 phút", status: "current" },
      { id: "b", title: "📜 AI Quiz Test After Lesson 144", type: "quiz_module", duration: "20 phút", status: "locked" },
      { id: "c", title: "Bài đã xong", type: "article", duration: "1 phút", status: "completed" },
      { id: "d", title: "Kiểm tra: Nền tảng bản thân", type: "article", duration: "15 phút", status: "locked" },
      { id: "e", title: "Thay đổi tư duy", type: "article", duration: "1 phút", status: "locked" },
    ],
  },
];

describe("CurriculumAccordion lesson icons", () => {
  it("uses a Lucide icon that matches each lesson kind", () => {
    render(<CurriculumAccordion modules={modules} courseId={67} />);

    expect(screen.getByLabelText("Bài video")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Bài kiểm tra")).toHaveLength(2);
    expect(screen.getByLabelText("Đã hoàn thành")).toBeInTheDocument();
    expect(screen.getByLabelText("Bài đọc")).toBeInTheDocument();
    expect(screen.queryByText("▶")).not.toBeInTheDocument();
    expect(screen.getByText("AI Quiz Test After Lesson 144")).toBeInTheDocument();
    expect(screen.queryByText("📜 AI Quiz Test After Lesson 144")).not.toBeInTheDocument();
  });
});
