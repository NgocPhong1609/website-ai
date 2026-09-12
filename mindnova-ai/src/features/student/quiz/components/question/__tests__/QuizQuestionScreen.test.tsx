import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizQuestionScreen } from "../QuizQuestionScreen";
import { useGetCourseQuiz, useGetStudentQuiz, useSubmitQuiz } from "../../../api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock("../../../api", () => ({
  useGetStudentQuiz: vi.fn(),
  useGetCourseQuiz: vi.fn(),
  useSubmitQuiz: vi.fn(),
}));

describe("QuizQuestionScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetCourseQuiz).mockReturnValue({ data: undefined, isLoading: false, isError: false } as any);
    vi.mocked(useSubmitQuiz).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any);
  });

  it("renders a legacy single-choice question as radios", () => {
    vi.mocked(useGetStudentQuiz).mockReturnValue({
      data: {
        id: 1,
        title: "Quiz",
        time_limit_minutes: 10,
        passing_score: 70,
        questions_count: 1,
        questions: [{
          id: 10,
          type: "multiple_choice",
          content: "Single",
          order: 1,
          answers: [{ id: 101, content: "A" }, { id: 102, content: "B" }],
        }],
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<QuizQuestionScreen lessonId="1" />);

    expect(screen.getByLabelText("Chọn đáp án A")).toHaveAttribute("type", "radio");
  });

  it("renders checkboxes and toggles a de-duplicated multiple selection", () => {
    vi.mocked(useGetStudentQuiz).mockReturnValue({
      data: {
        id: 1,
        title: "Quiz",
        time_limit_minutes: 10,
        passing_score: 70,
        questions_count: 1,
        questions: [{
          id: 10,
          type: "multiple_choice",
          selection_type: "multiple_choice",
          content: "Multiple",
          order: 1,
          answers: [{ id: 101, content: "A" }, { id: 102, content: "B" }],
        }],
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<QuizQuestionScreen lessonId="1" />);
    const first = screen.getByLabelText("Chọn đáp án A");
    const second = screen.getByLabelText("Chọn đáp án B");

    expect(first).toHaveAttribute("type", "checkbox");
    fireEvent.click(first);
    fireEvent.click(second);
    expect(first).toBeChecked();
    expect(second).toBeChecked();
    fireEvent.click(first);
    expect(first).not.toBeChecked();
    expect(second).toBeChecked();
  });

  it("renders question and answer images with meaningful alternative text", () => {
    vi.mocked(useGetStudentQuiz).mockReturnValue({
      data: {
        id: 1,
        title: "Quiz có hình",
        time_limit_minutes: 10,
        passing_score: 70,
        questions_count: 1,
        questions: [{
          id: 10,
          type: "multiple_choice",
          content: "Nhận diện sơ đồ",
          image_url: "https://cdn.example/question.png",
          order: 1,
          answers: [{ id: 101, content: "Sơ đồ A", image_url: "https://cdn.example/answer-a.png" }],
        }],
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<QuizQuestionScreen lessonId="1" />);

    expect(screen.getByRole("img", { name: "Hình minh họa câu hỏi: Nhận diện sơ đồ" })).toHaveAttribute("src", "https://cdn.example/question.png");
    expect(screen.getByRole("img", { name: "Hình minh họa đáp án A: Sơ đồ A" })).toHaveAttribute("src", "https://cdn.example/answer-a.png");
  });
});
