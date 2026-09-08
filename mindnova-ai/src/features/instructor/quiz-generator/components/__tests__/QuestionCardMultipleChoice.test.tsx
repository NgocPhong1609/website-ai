import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionCardMultipleChoice } from "../QuestionCardMultipleChoice";
import type { GeneratedQuestion } from "../../types/quizGenerator.types";

const makeQuestion = (overrides: Partial<GeneratedQuestion> = {}): GeneratedQuestion => ({
  id: "q1",
  type: "multiple_choice",
  selection_type: "single_choice",
  difficulty: "medium",
  question: "Chọn đáp án",
  options: ["A", "B", "C"],
  correct_answer_index: 0,
  correct_answer_indices: [0],
  explanation: "",
  points: 1,
  reviewStatus: "edited",
  ...overrides,
});

const renderCard = (question: GeneratedQuestion, onUpdate = vi.fn()) => {
  render(
    <QuestionCardMultipleChoice
      question={question}
      index={0}
      onUpdate={onUpdate}
      onApprove={vi.fn()}
      onDelete={vi.fn()}
      onRegenerate={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));
  return onUpdate;
};

describe("QuestionCardMultipleChoice", () => {
  it("keeps legacy questions in single-choice radio mode", () => {
    renderCard(makeQuestion({ selection_type: undefined, correct_answer_indices: undefined }));

    expect(screen.getByLabelText("Đáp án đúng A")).toHaveAttribute("type", "radio");
    expect(screen.getByLabelText("Đáp án đúng B")).toHaveAttribute("type", "radio");
  });

  it("uses checkboxes and saves every correct answer in multiple-choice mode", () => {
    const onUpdate = renderCard(makeQuestion({
      selection_type: "multiple_choice",
      correct_answer_indices: [0, 1],
    }));

    expect(screen.getByLabelText("Đáp án đúng A")).toHaveAttribute("type", "checkbox");
    expect(screen.getByLabelText("Đáp án đúng B")).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: /lưu sửa/i }));

    expect(onUpdate).toHaveBeenCalledWith("q1", expect.objectContaining({
      selection_type: "multiple_choice",
      correct_answer_indices: [0, 1],
    }));
  });

  it("does not switch to single-choice while multiple answers remain correct", () => {
    renderCard(makeQuestion({
      selection_type: "multiple_choice",
      correct_answer_indices: [0, 1],
    }));

    fireEvent.click(screen.getByLabelText("Chế độ một đáp án đúng"));

    expect(screen.getByText(/chỉ giữ lại một đáp án đúng/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Chế độ nhiều đáp án đúng")).toBeChecked();
  });
});
