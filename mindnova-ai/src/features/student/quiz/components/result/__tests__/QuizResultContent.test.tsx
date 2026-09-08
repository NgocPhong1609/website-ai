import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuizResultContent } from "../QuizResultContent";
import { useGetQuizAttemptResult } from "../../../api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: (key: string) => key === "attemptId" ? "55" : null }),
}));

vi.mock("../../../api", () => ({
  useGetQuizAttemptResult: vi.fn(),
}));

describe("QuizResultContent", () => {
  it("shows selected-correct, missed-correct, selected-incorrect and partial points", () => {
    vi.mocked(useGetQuizAttemptResult).mockReturnValue({
      data: {
        attempt_id: 55,
        score: 50,
        score_10: 5,
        accuracy: "50%",
        passed: false,
        correct_count: 0,
        total_questions: 1,
        question_results: [{
          question_id: 10,
          order: 1,
          content: "Select all",
          image_url: "https://cdn.example/question.png",
          type: "multiple_choice",
          selection_type: "multiple_choice",
          selected_answer_ids: [101, 103],
          correct_answer_ids: [101, 102],
          answer_options: [
            { id: 101, content: "A", image_url: "https://cdn.example/answer-a.png" },
            { id: 102, content: "B", image_url: "https://cdn.example/answer-b.png" },
            { id: 103, content: "C" },
          ],
          is_correct: false,
          score: 1,
          max_score: 2,
        }],
      },
      isLoading: false,
    } as any);

    render(<QuizResultContent />);
    fireEvent.click(screen.getByText("Bắt đầu soát bài"));

    expect(screen.getByText("Điểm: 1 / 2 điểm")).toBeInTheDocument();
    expect(screen.getByText("Đã chọn · đúng")).toBeInTheDocument();
    expect(screen.getByText("Đáp án đúng bị bỏ lỡ")).toBeInTheDocument();
    expect(screen.getByText("Đã chọn · chưa đúng")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Hình minh họa câu hỏi: Select all" })).toHaveAttribute("src", "https://cdn.example/question.png");
    expect(screen.getByRole("img", { name: "Hình minh họa đáp án: A" })).toHaveAttribute("src", "https://cdn.example/answer-a.png");
  });

  it("shows answer images for legacy single-choice results", () => {
    vi.mocked(useGetQuizAttemptResult).mockReturnValue({
      data: {
        attempt_id: 55,
        score: 100,
        score_10: 10,
        accuracy: "100%",
        passed: true,
        correct_count: 1,
        total_questions: 1,
        question_results: [{
          question_id: 11,
          order: 1,
          content: "Pick one",
          type: "multiple_choice",
          selection_type: "single_choice",
          user_answer_text: "A",
          correct_answer: "A",
          answer_options: [{ id: 201, content: "A", image_url: "https://cdn.example/single-a.png" }],
          is_correct: true,
          score: 1,
          max_score: 1,
        }],
      },
      isLoading: false,
    } as any);

    render(<QuizResultContent />);
    fireEvent.click(screen.getByText("Bắt đầu soát bài"));

    expect(screen.getByRole("img", { name: "Hình minh họa đáp án: A" })).toHaveAttribute("src", "https://cdn.example/single-a.png");
  });
});
