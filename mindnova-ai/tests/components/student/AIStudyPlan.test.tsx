import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIStudyPlanContainer } from "@/src/components/page/student/ai-study-plan/AIStudyPlanContainer";

// Mock scrollIntoView for chat auto-scroll in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Student AI Study Plan (UI/UX Rule #7) Suite", () => {
  it("renders AIStudyPlanContainer with Vietnamese header, tabs and live Nova Tutor chat", () => {
    render(<AIStudyPlanContainer />);

    expect(screen.getByText(/Lộ trình & Gia sư Trí tuệ Nhân tạo/i)).toBeInTheDocument();
    expect(screen.getByText(/Nova AI Tutor 24\/7/i)).toBeInTheDocument();
    expect(screen.getByText(/📑 Tóm tắt Bài giảng/i)).toBeInTheDocument();
    expect(screen.getByText(/Gia sư trực tuyến 24\/7/i)).toBeInTheDocument();
  });

  it("switches to RoadmapGenerator tab and renders dynamic visual pathway graph", () => {
    render(<AIStudyPlanContainer />);

    const roadmapTab = screen.getByText(/🗺️ Lộ trình AI Động/i);
    fireEvent.click(roadmapTab);

    expect(screen.getByText(/Biểu đồ Lộ trình Kiến thức Động MindNova/i)).toBeInTheDocument();
    expect(screen.getByText(/⚡ Tái lập trình Lộ trình AI/i)).toBeInTheDocument();
  });

  it("switches to AIFlashcards tab and renders interactive swipe cards", () => {
    render(<AIStudyPlanContainer />);

    const flashcardsTab = screen.getByText(/🗂️ Thẻ ôn tập Flashcard/i);
    fireEvent.click(flashcardsTab);

    expect(screen.getByText(/Thẻ ghi nhớ Flashcard Tương tác AI/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cần ôn lại/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Đã làm chủ|Đã nhớ/i).length).toBeGreaterThan(0);
  });

  it("allows user to type and send a message to Nova AI Tutor", async () => {
    render(<AIStudyPlanContainer />);

    const input = screen.getByPlaceholderText(/Hỏi Nova giải thích/i);
    fireEvent.change(input, { target: { value: "Làm thế nào để tối ưu hóa Redis Cache?" } });
    
    const sendButton = screen.getByTitle("Gửi câu hỏi");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Làm thế nào để tối ưu hóa Redis Cache?")).toBeInTheDocument();
    });
  });
});
