import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
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

const renderEditor = (
  isReviewConfirmed = false,
  overrides: Partial<React.ComponentProps<typeof Step4ReviewEditor>> = {},
) => {
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
    ...overrides,
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

  it("locks passing-score editing while a save is in flight", () => {
    renderEditor(true, { isSaving: true });

    expect(screen.getByRole("spinbutton", { name: /điểm đạt/i })).toBeDisabled();
  });

  it.each([
    ["an empty value", ""],
    ["a fractional value", "70.5"],
    ["a value below zero", "-1"],
    ["a value above one hundred", "101"],
  ])("rejects %s and independently blocks confirmation and saving", (_case, value) => {
    const { props, rerender } = renderEditor(false);
    const passingScore = screen.getByRole("spinbutton", { name: /điểm đạt/i });

    expect(screen.getByRole("button", { name: /xác nhận toàn bộ câu hỏi/i })).toBeEnabled();
    fireEvent.change(passingScore, { target: { value } });

    expect(passingScore).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(/số nguyên từ 0 đến 100/i);
    expect(props.onChangeConfig).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /xác nhận toàn bộ câu hỏi/i })).toBeDisabled();

    rerender(<Step4ReviewEditor {...props} isReviewConfirmed />);
    expect(screen.getByRole("button", { name: /lưu nháp/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /hoàn tất/i })).toBeDisabled();
  });

  it("derives final question counts from the live review set after deletion", () => {
    const essayQuestion: GeneratedQuestion = {
      ...question,
      id: "q2",
      type: "essay",
      options: [],
      correct_answer_index: null,
      correct_answer_indices: [],
    };
    const staleConfig = {
      ...config,
      total_questions: 10,
      multiple_choice_count: 8,
      essay_count: 2,
    };
    const { props, rerender } = renderEditor(false, {
      config: staleConfig,
      questions: [question, essayQuestion],
    });
    const getSummary = () => screen.getByRole("region", { name: /cấu hình bài kiểm tra/i });

    expect(within(getSummary()).getByText("2 câu hỏi")).toBeInTheDocument();
    expect(within(getSummary()).getByText("1 câu trắc nghiệm")).toBeInTheDocument();
    expect(within(getSummary()).getByText("1 câu tự luận")).toBeInTheDocument();

    rerender(<Step4ReviewEditor {...props} questions={[essayQuestion]} />);
    expect(within(getSummary()).getByText("1 câu hỏi")).toBeInTheDocument();
    expect(within(getSummary()).getByText("0 câu trắc nghiệm")).toBeInTheDocument();
    expect(within(getSummary()).getByText("1 câu tự luận")).toBeInTheDocument();
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
