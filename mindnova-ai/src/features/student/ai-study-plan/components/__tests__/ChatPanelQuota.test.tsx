import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiQuotaError, sendAiChatMessage } from "../../services/ai-chat.client-service";
import { ChatPanel } from "../ChatPanel";

vi.mock("../../services/ai-chat.client-service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/ai-chat.client-service")>();
  return { ...actual, sendAiChatMessage: vi.fn() };
});

const quota = {
  package: "free" as const,
  daily_limit: 5,
  used: 1,
  remaining: 4,
  resets_at: "2099-09-10T00:00:00+07:00",
};

function renderChatPanel() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const renderWithPrompt = (externalPrompt: string | null, onClearExternalPrompt?: () => void) => (
    <QueryClientProvider client={queryClient}>
      <ChatPanel
        initialMessages={[]}
        syllabusTitle="Khóa kiểm thử"
        lessonId={42}
        externalPrompt={externalPrompt}
        onClearExternalPrompt={onClearExternalPrompt}
      />
    </QueryClientProvider>
  );
  const view = render(renderWithPrompt(null));
  return {
    ...view,
    rerenderPrompt: (externalPrompt: string, onClearExternalPrompt: () => void) =>
      view.rerender(renderWithPrompt(externalPrompt, onClearExternalPrompt)),
  };
}

async function submitQuestion() {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Giải thích bài học" } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
}

describe("ChatPanel quota", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(sendAiChatMessage).mockReset();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("shows the authoritative remaining quota after a successful reply", async () => {
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-1", sender: "ai", timestamp: "Vừa xong", text: "Câu trả lời" },
      quota,
    });
    renderChatPanel();

    await submitQuestion();

    expect(await screen.findByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 4/5 lượt hôm nay");
  });

  it("blocks typed, quick, rephrase, and external sends after a successful final allowance", async () => {
    const exhaustedQuota = { ...quota, used: 5, remaining: 0 };
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-final", sender: "ai", timestamp: "Vừa xong", text: "Đã trả lời" },
      quota: exhaustedQuota,
    });
    const view = renderChatPanel();

    await submitQuestion();

    expect(await screen.findByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 0/5 lượt hôm nay");
    await waitFor(() => expect(screen.getByRole("textbox")).toBeEnabled());
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Câu hỏi bị chặn" } });
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    for (const tag of ["Ví dụ trực quan", "Ôn tập nhanh", "Tóm tắt bài"]) {
      fireEvent.click(screen.getByText(tag).closest("button")!);
      expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    }
    fireEvent.click(screen.getByRole("button", { name: "Giải thích dễ hiểu hơn" }));
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    const onClearExternalPrompt = vi.fn();
    view.rerenderPrompt("Câu hỏi ngoài bị chặn", onClearExternalPrompt);

    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    expect(onClearExternalPrompt).not.toHaveBeenCalled();
  });

  it("blocks a 429 quota state, then sends again and replaces quota after its future reset", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T00:00:00Z"));
    const resetQuota = { ...quota, used: 5, remaining: 0, resets_at: "2026-09-09T00:00:01Z" };
    vi.mocked(sendAiChatMessage)
      .mockRejectedValueOnce(new AiQuotaError("Bạn đã sử dụng hết 5 lượt AI hôm nay.", resetQuota))
      .mockResolvedValueOnce({
        message: { id: "ai-reset", sender: "ai", timestamp: "Vừa xong", text: "Hạn mức đã làm mới" },
        quota,
      });
    renderChatPanel();

    await submitQuestion();
    await act(async () => { await vi.advanceTimersByTimeAsync(900); });

    expect(screen.getByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 0/5 lượt hôm nay");
    expect(screen.getByText("Bạn đã sử dụng hết 5 lượt AI hôm nay.")).toBeVisible();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Kiểm tra hạn mức mới" } });
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);

    await act(async () => { await vi.advanceTimersByTimeAsync(101); });
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });

    expect(sendAiChatMessage).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 4/5 lượt hôm nay");
  });

  it("places the quota in a shrinkable, wrapping input region at a 390px viewport", async () => {
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-2", sender: "ai", timestamp: "Vừa xong", text: "Câu trả lời" },
      quota,
    });
    renderChatPanel();
    await submitQuestion();

    const inputRegion = await screen.findByLabelText("Khung nhập tin nhắn AI");
    const quotaLabel = within(inputRegion).getByLabelText("Hạn mức AI hôm nay");
    const inputWrapper = within(inputRegion).getByRole("textbox").parentElement;

    expect(window.innerWidth).toBe(390);
    expect(inputRegion).toContainElement(quotaLabel);
    expect(inputRegion).toHaveClass("w-full", "min-w-0");
    expect(inputWrapper).toHaveClass("min-w-0");
    expect(quotaLabel.parentElement).toHaveClass("flex-wrap");
  });
});
