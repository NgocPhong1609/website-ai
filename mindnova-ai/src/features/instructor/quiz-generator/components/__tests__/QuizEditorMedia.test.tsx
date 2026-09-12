import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizEditor } from "../../../create-course/components/QuizEditor";
import { quizGeneratorApi } from "../../api/quizGeneratorApi";

vi.mock("../../api/quizGeneratorApi", () => ({
  quizGeneratorApi: {
    getQuizById: vi.fn(),
    uploadMedia: vi.fn(),
  },
}));

vi.mock("../SelectQuizModal", () => ({
  SelectQuizModal: () => null,
}));

vi.mock("../QuestionCardMultipleChoice", () => ({
  QuestionCardMultipleChoice: () => null,
}));

vi.mock("../QuestionCardEssay", () => ({
  QuestionCardEssay: () => null,
}));

describe("QuizEditor media", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(quizGeneratorApi.getQuizById).mockResolvedValue({
      id: 7,
      title: "Quiz hình ảnh",
      description: "Mô tả",
      thumbnail_url: "https://cdn.example.test/original.png",
      thumbnail_r2_key: "quizzes/7/thumbnail/original.png",
      time_limit_minutes: 15,
      passing_score: 70,
      difficulty: "medium",
      questions: [],
    });
  });

  it("loads the thumbnail controls and includes a replacement in editor changes", async () => {
    const onChange = vi.fn();
    vi.mocked(quizGeneratorApi.uploadMedia).mockResolvedValue({
      url: "http://localhost:8000/storage/temp/quiz-media/1/replacement.png",
      r2_key: "temp/quiz-media/1/replacement.png",
      mime_type: "image/png",
      size_bytes: 20,
      purpose: "thumbnail",
    });

    render(<QuizEditor quizId={7} onChange={onChange} />);

    expect(await screen.findByAltText("Xem trước Ảnh đại diện Quiz")).toHaveAttribute(
      "src",
      "https://cdn.example.test/original.png",
    );

    fireEvent.change(screen.getByLabelText("Tải ảnh đại diện quiz"), {
      target: { files: [new File(["image"], "replacement.png", { type: "image/png" })] },
    });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      thumbnail_url: "http://localhost:8000/storage/temp/quiz-media/1/replacement.png",
      thumbnail_r2_key: "temp/quiz-media/1/replacement.png",
    })));
  });
});
