import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AIAssistCard } from "../LessonManagementContainer";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("AIAssistCard", () => {
  it("presents two described actions in a responsive AI workspace", () => {
    render(<AIAssistCard courseId="42" onSuggestChapter={vi.fn()} />);

    expect(screen.getByRole("region", { name: /mindnova ai assist/i })).toBeInTheDocument();

    const createQuiz = screen.getByRole("link", { name: /tạo quiz bằng ai/i });
    expect(createQuiz).toHaveAttribute("href", "/instructor/quiz-generator?course_id=42");
    expect(createQuiz).toHaveAccessibleDescription(/tạo bộ câu hỏi/i);

    const suggestChapter = screen.getByRole("button", { name: /gợi ý chương mới/i });
    expect(suggestChapter).toHaveAccessibleDescription(/mở trình soạn thảo chương/i);
    expect(createQuiz.parentElement).toHaveClass("grid-cols-1", "sm:grid-cols-2");
  });

  it("shows real loading state without hiding either action", async () => {
    const request = deferred<void>();
    render(<AIAssistCard courseId="42" onSuggestChapter={() => request.promise} />);

    fireEvent.click(screen.getByRole("button", { name: /gợi ý chương mới/i }));

    expect(screen.getByRole("button", { name: /đang mở trình soạn thảo/i })).toBeDisabled();
    expect(screen.getByRole("link", { name: /tạo quiz bằng ai/i })).toBeInTheDocument();

    request.resolve();
    expect(await screen.findByRole("button", { name: /gợi ý chương mới/i })).toBeEnabled();
  });

  it("announces a failed suggestion and retries the same handler", async () => {
    const onSuggestChapter = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error("Không thể mở trình soạn thảo"))
      .mockResolvedValueOnce();
    render(<AIAssistCard courseId="42" onSuggestChapter={onSuggestChapter} />);

    fireEvent.click(screen.getByRole("button", { name: /gợi ý chương mới/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Không thể mở trình soạn thảo");
    expect(screen.getByRole("link", { name: /tạo quiz bằng ai/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /gợi ý chương mới/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /thử lại/i }));

    expect(onSuggestChapter).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole("button", { name: /gợi ý chương mới/i })).toBeEnabled();
  });
});
