import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Step4ReviewEditor } from "../Step4ReviewEditor";
import { useAiQuizWizard } from "../../hooks/useAiQuizWizard";
import { quizGeneratorApi } from "../../api/quizGeneratorApi";
import type { GeneratedQuestion } from "../../types/quizGenerator.types";
import type { QuizConfig } from "../../types/quizGenerator.types";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../../api/quizGeneratorApi", () => ({
  quizGeneratorApi: {
    generateQuiz: vi.fn(),
    regenerateSingleQuestion: vi.fn(),
    saveQuiz: vi.fn(),
  },
}));

const question: GeneratedQuestion = {
  id: "q1",
  type: "multiple_choice",
  selection_type: "single_choice",
  difficulty: "medium",
  question: "Câu hỏi AI",
  options: ["A", "B"],
  correct_answer_index: 0,
  correct_answer_indices: [0],
  answer_images: [{ url: null, r2_key: null }, { url: null, r2_key: null }],
  explanation: "",
  points: 10,
  reviewStatus: "pending",
};

const config: QuizConfig = {
  title: "Đề kiểm tra cuối chương",
  description: "Ôn tập kiến thức trọng tâm",
  source_type: "topic",
  source_content: "",
  topic: "React căn bản",
  difficulty: "mixed",
  total_questions: 1,
  multiple_choice_count: 1,
  essay_count: 0,
  time_limit_minutes: 20,
  passing_score: 70,
};

const renderEditor = (isReviewConfirmed = false) => {
  const props = {
    questions: [question],
    config,
    onChangeConfig: vi.fn(),
    isReviewConfirmed,
    onConfirmAll: vi.fn(),
    onUpdateQuestion: vi.fn(),
    onApproveQuestion: vi.fn(),
    onDeleteQuestion: vi.fn(),
    onRegenerateQuestion: vi.fn(),
    onRegenerateAll: vi.fn(),
    onSave: vi.fn(),
    onBack: vi.fn(),
    isSaving: false,
  };

  const view = render(<Step4ReviewEditor {...props} />);
  return { ...view, props };
};

describe("Step4ReviewEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires whole-set confirmation before either save action", () => {
    const { props } = renderEditor();

    expect(screen.getByRole("button", { name: /lưu nháp/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /hoàn tất/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /xác nhận toàn bộ câu hỏi/i }));
    expect(props.onConfirmAll).toHaveBeenCalledOnce();
  });

  it("enables saving once a valid ten-point set is confirmed", () => {
    renderEditor(true);

    expect(screen.getByRole("button", { name: /lưu nháp/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /hoàn tất/i })).toBeEnabled();
  });

  it("keeps the final quiz configuration visible and edits the passing score", () => {
    const { props } = renderEditor(true);

    expect(screen.getByRole("heading", { name: /cấu hình bài kiểm tra/i })).toBeInTheDocument();
    expect(screen.getByText("Đề kiểm tra cuối chương")).toBeInTheDocument();
    expect(screen.getByText("20 phút")).toBeInTheDocument();
    expect(screen.getByText(/1 câu trắc nghiệm/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("spinbutton", { name: /điểm đạt/i }), {
      target: { value: "85" },
    });

    expect(props.onChangeConfig).toHaveBeenCalledWith({ passing_score: 85 });
  });
});

describe("useAiQuizWizard review confirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(quizGeneratorApi.generateQuiz).mockResolvedValue({
      success: true,
      data: { questions: [question] },
    } as never);
    vi.mocked(quizGeneratorApi.regenerateSingleQuestion).mockResolvedValue({
      success: true,
      data: { ...question, question: "Câu hỏi sinh lại" },
    } as never);
  });

  const generateAndConfirm = async () => {
    const hook = renderHook(() => useAiQuizWizard());
    await act(async () => hook.result.current.handleGenerate());
    act(() => hook.result.current.confirmAllQuestions());
    expect(hook.result.current.isReviewConfirmed).toBe(true);
    return hook;
  };

  it("invalidates confirmation after content or image edits and deletion", async () => {
    const hook = await generateAndConfirm();

    act(() => hook.result.current.updateQuestion("q1", { image_url: "https://cdn.example/q.png" }));
    expect(hook.result.current.isReviewConfirmed).toBe(false);

    act(() => hook.result.current.confirmAllQuestions());
    act(() => hook.result.current.deleteQuestion("q1"));
    expect(hook.result.current.isReviewConfirmed).toBe(false);
  });

  it("invalidates confirmation after regenerating one question or the complete set", async () => {
    const hook = await generateAndConfirm();

    await act(async () => hook.result.current.regenerateSingleQuestion("q1", "multiple_choice", "medium"));
    expect(hook.result.current.isReviewConfirmed).toBe(false);

    act(() => hook.result.current.confirmAllQuestions());
    await act(async () => hook.result.current.handleGenerate());
    expect(hook.result.current.isReviewConfirmed).toBe(false);
  });

  it("invalidates confirmation when the review passing score changes", async () => {
    const hook = await generateAndConfirm();

    act(() => hook.result.current.updateConfig({ passing_score: 85 }));

    expect(hook.result.current.config.passing_score).toBe(85);
    expect(hook.result.current.isReviewConfirmed).toBe(false);
  });

  it("saves the final passing score edited during review", async () => {
    vi.mocked(quizGeneratorApi.saveQuiz).mockResolvedValue({
      success: true,
      data: { id: 9 },
    } as never);
    const hook = await generateAndConfirm();

    act(() => hook.result.current.updateConfig({ passing_score: 85 }));
    act(() => hook.result.current.confirmAllQuestions());
    await act(async () => hook.result.current.handleSaveQuiz("published"));

    expect(quizGeneratorApi.saveQuiz).toHaveBeenCalledWith(
      expect.objectContaining({ passing_score: 85, status: "published" }),
    );
  });
});
