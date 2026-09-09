import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiQuotaError, sendAiChatMessage } from "../../../ai-study-plan/services/ai-chat.client-service";
import { FloatingAiChat } from "../FloatingAiChat";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
vi.mock("../../../ai-study-plan/services/ai-chat.client-service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../ai-study-plan/services/ai-chat.client-service")>();
  return { ...actual, sendAiChatMessage: vi.fn() };
});

const quota = {
  package: "free" as const,
  daily_limit: 5,
  used: 1,
  remaining: 4,
  resets_at: "2099-09-10T00:00:00+07:00",
};

function renderFloatingChat() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <FloatingAiChat />
    </QueryClientProvider>
  );
}

async function openAndSubmitQuestion() {
  fireEvent.click(screen.getByRole("button", { name: "Hỏi Gia sư AI" }));
  fireEvent.change(screen.getByPlaceholderText("Nhập câu hỏi cho Nova..."), {
    target: { value: "Giải thích bài học" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Gửi tin nhắn" }));
}

describe("FloatingAiChat quota", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(sendAiChatMessage).mockReset();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 844 });
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
    renderFloatingChat();

    await openAndSubmitQuestion();

    expect(await screen.findByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 4/5 lượt hôm nay");
  });

  it("blocks typed, form, quick, and programmatic sends after a successful final allowance", async () => {
    const exhaustedQuota = { ...quota, used: 5, remaining: 0 };
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-final", sender: "ai", timestamp: "Vừa xong", text: "Đã trả lời" },
      quota: exhaustedQuota,
    });
    renderFloatingChat();

    await openAndSubmitQuestion();

    expect(await screen.findByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 0/5 lượt hôm nay");
    await waitFor(() => expect(screen.getByRole("textbox")).toBeEnabled());
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Câu hỏi bị chặn" } });
    expect(screen.getByRole("button", { name: "Gửi tin nhắn" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    for (const label of ["Tổng hợp tiến độ", "Kiểm tra kiến thức", "Gợi ý bài học tiếp"]) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
    }
    act(() => {
      window.dispatchEvent(new CustomEvent("open-ai-tutor-chat", {
        detail: { initialQuery: "Câu hỏi chương trình bị chặn", autoSend: true },
      }));
    });

    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);
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
    renderFloatingChat();

    await openAndSubmitQuestion();
    await act(async () => { await vi.advanceTimersByTimeAsync(900); });

    expect(screen.getByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 0/5 lượt hôm nay");
    expect(screen.getByText("Bạn đã sử dụng hết 5 lượt AI hôm nay.")).toBeVisible();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Kiểm tra hạn mức mới" } });
    expect(screen.getByRole("button", { name: "Gửi tin nhắn" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(sendAiChatMessage).toHaveBeenCalledTimes(1);

    await act(async () => { await vi.advanceTimersByTimeAsync(101); });
    expect(screen.getByRole("button", { name: "Gửi tin nhắn" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Gửi tin nhắn" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });

    expect(sendAiChatMessage).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 4/5 lượt hôm nay");
  });

  it("places the quota in a shrinkable input region at a 390px viewport", async () => {
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-2", sender: "ai", timestamp: "Vừa xong", text: "Câu trả lời" },
      quota,
    });
    renderFloatingChat();
    await openAndSubmitQuestion();

    const inputRegion = await screen.findByLabelText("Khung nhập tin nhắn AI");
    const quotaLabel = within(inputRegion).getByLabelText("Hạn mức AI hôm nay");
    const form = within(inputRegion).getByRole("textbox").closest("form");

    expect(window.innerWidth).toBe(390);
    expect(inputRegion).toContainElement(quotaLabel);
    expect(inputRegion).toHaveClass("w-full", "min-w-0");
    expect(form).toHaveClass("min-w-0");
    expect(within(inputRegion).getByRole("textbox")).toHaveClass("min-w-0");
    expect(quotaLabel).toHaveClass("block");
  });
});
