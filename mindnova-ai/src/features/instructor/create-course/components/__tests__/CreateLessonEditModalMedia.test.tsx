import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateLessonEditModal } from "../CreateLessonEditModal";
import { quizGeneratorApi } from "../../../quiz-generator/api/quizGeneratorApi";

vi.mock("../QuizEditor", () => ({
  QuizEditor: ({ onChange }: { onChange: (value: unknown) => void }) => (
    <button
      type="button"
      onClick={() => onChange({
        id: 7,
        title: "Quiz hình ảnh",
        description: "Mô tả",
        thumbnail_url: "http://localhost:8000/storage/temp/quiz-media/1/cover.png",
        thumbnail_r2_key: "temp/quiz-media/1/cover.png",
        time_limit_minutes: 15,
        passing_score: 70,
        difficulty: "medium",
        questions: [],
      })}
    >
      Cập nhật ảnh trong editor
    </button>
  ),
}));

vi.mock("../../api", () => ({
  useUploadTempMedia: () => ({ mutateAsync: vi.fn() }),
  useDeleteTempMedia: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock("../../../quiz-generator/api/quizGeneratorApi", () => ({
  quizGeneratorApi: { updateQuiz: vi.fn().mockResolvedValue({}) },
}));

vi.mock("../../../lesson-management/components/LessonAttachments", () => ({
  LessonAttachments: () => null,
}));

describe("CreateLessonEditModal quiz media", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(quizGeneratorApi.updateQuiz).mockResolvedValue({
      data: {
        id: 7,
        title: "Quiz hình ảnh",
        description: "Mô tả",
        thumbnail_url: "https://cdn.example.test/quizzes/7/thumbnail/cover.png",
        thumbnail_r2_key: "quizzes/7/thumbnail/cover.png",
        time_limit_minutes: 15,
        passing_score: 70,
        difficulty: "medium",
        questions: [],
      },
    });
  });

  it("sends thumbnail metadata when saving an edited quiz", async () => {
    const onSave = vi.fn();
    render(
      <CreateLessonEditModal
        lesson={{ id: "quiz-7", quiz_id: 7, title: "Quiz hình ảnh", type: "quiz", order: 1 } as any}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cập nhật ảnh trong editor" }));
    fireEvent.click(screen.getByRole("button", { name: "Lưu bài học" }));

    await waitFor(() => expect(quizGeneratorApi.updateQuiz).toHaveBeenCalledWith(7, expect.objectContaining({
      thumbnail_url: "http://localhost:8000/storage/temp/quiz-media/1/cover.png",
      thumbnail_r2_key: "temp/quiz-media/1/cover.png",
    })));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith("quiz-7", expect.objectContaining({
      quizData: expect.objectContaining({
        thumbnail_url: "https://cdn.example.test/quizzes/7/thumbnail/cover.png",
        thumbnail_r2_key: "quizzes/7/thumbnail/cover.png",
      }),
    })));
  });

  it("keeps the modal open and shows the API error when quiz saving fails", async () => {
    const onSave = vi.fn();
    vi.mocked(quizGeneratorApi.updateQuiz).mockRejectedValue({
      response: { data: { message: "Không thể lưu ảnh vào bài kiểm tra." } },
    });

    render(
      <CreateLessonEditModal
        lesson={{ id: "quiz-7", quiz_id: 7, title: "Quiz hình ảnh", type: "quiz", order: 1 } as any}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cập nhật ảnh trong editor" }));
    fireEvent.click(screen.getByRole("button", { name: "Lưu bài học" }));

    expect(await screen.findByText("Không thể lưu ảnh vào bài kiểm tra.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "📝 Chỉnh Sửa Bài Kiểm Tra" })).toBeInTheDocument();
  });
});
