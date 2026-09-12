import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizImageField } from "../QuizImageField";
import { quizGeneratorApi } from "../../api/quizGeneratorApi";

vi.mock("../../api/quizGeneratorApi", () => ({
  quizGeneratorApi: { uploadMedia: vi.fn() },
}));

describe("QuizImageField", () => {
  beforeEach(() => vi.clearAllMocks());

  it("validates image type and maximum size before upload", async () => {
    render(<QuizImageField label="Ảnh câu hỏi" purpose="question" value={{ url: null, r2_key: null }} onChange={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Tải ảnh câu hỏi"), {
      target: { files: [new File(["x"], "vector.svg", { type: "image/svg+xml" })] },
    });
    expect(await screen.findByText(/jpeg, png, webp hoặc gif/i)).toBeInTheDocument();

    const large = new File(["x"], "large.png", { type: "image/png" });
    Object.defineProperty(large, "size", { value: 5 * 1024 * 1024 + 1 });
    fireEvent.change(screen.getByLabelText("Tải ảnh câu hỏi"), { target: { files: [large] } });
    expect(await screen.findByText(/không được vượt quá 5 mb/i)).toBeInTheDocument();
    expect(quizGeneratorApi.uploadMedia).not.toHaveBeenCalled();
  });

  it("uploads previews and remove clears both managed fields", async () => {
    const onChange = vi.fn();
    vi.mocked(quizGeneratorApi.uploadMedia).mockResolvedValue({
      url: "https://cdn.example.test/temp.png",
      r2_key: "temp/quiz-media/1/temp.png",
      mime_type: "image/png",
      size_bytes: 20,
    });
    const { rerender } = render(
      <QuizImageField label="Ảnh câu hỏi" purpose="question" value={{ url: null, r2_key: null }} onChange={onChange} />,
    );
    const file = new File(["image"], "question.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Tải ảnh câu hỏi"), { target: { files: [file] } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith({
      url: "https://cdn.example.test/temp.png",
      r2_key: "temp/quiz-media/1/temp.png",
    }));

    rerender(<QuizImageField label="Ảnh câu hỏi" purpose="question" value={{ url: "https://cdn.example.test/temp.png", r2_key: "temp/quiz-media/1/temp.png" }} onChange={onChange} />);
    expect(screen.getByAltText("Xem trước Ảnh câu hỏi")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xóa Ảnh câu hỏi" }));
    expect(onChange).toHaveBeenLastCalledWith({ url: null, r2_key: null });
  });

  it("accepts HTTP external urls and clears the managed key", () => {
    const onChange = vi.fn();
    render(<QuizImageField label="Ảnh đáp án" purpose="answer" value={{ url: "https://cdn.example.test/upload.png", r2_key: "temp/key.png" }} onChange={onChange} />);
    const input = screen.getByLabelText("URL ngoài cho Ảnh đáp án");

    fireEvent.change(input, { target: { value: "ftp://example.test/image.png" } });
    fireEvent.click(screen.getByRole("button", { name: "Dùng URL cho Ảnh đáp án" }));
    expect(screen.getByText(/http hoặc https/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "https://example.test/image.png" } });
    fireEvent.click(screen.getByRole("button", { name: "Dùng URL cho Ảnh đáp án" }));
    expect(onChange).toHaveBeenLastCalledWith({ url: "https://example.test/image.png", r2_key: null });
  });
});
