import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatPanel initialMessages={[]} syllabusTitle="Khóa kiểm thử" lessonId={42} />
    </QueryClientProvider>
  );
}

async function submitQuestion() {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Giải thích bài học" } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
}

function controlledRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("ChatPanel quota", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(sendAiChatMessage).mockReset();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
  });

  afterEach(cleanup);

  it("shows the authoritative remaining quota after a successful reply", async () => {
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-1", sender: "ai", timestamp: "Vừa xong", text: "Câu trả lời" },
      quota,
    });
    renderChatPanel();

    await submitQuestion();

    expect(await screen.findByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 4/5 lượt hôm nay");
  });

  it("renders the backend exhaustion message and disables sending before reset", async () => {
    const exhaustedQuota = { ...quota, used: 5, remaining: 0 };
    vi.mocked(sendAiChatMessage).mockRejectedValue(
      new AiQuotaError("Bạn đã sử dụng hết 5 lượt AI hôm nay.", exhaustedQuota)
    );
    renderChatPanel();

    await submitQuestion();

    expect(await screen.findByText("Bạn đã sử dụng hết 5 lượt AI hôm nay.")).toBeVisible();
    expect(screen.getByLabelText("Hạn mức AI hôm nay")).toHaveTextContent("Còn 0/5 lượt hôm nay");
    await waitFor(() => expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled());
  });

  it("allows another backend check after the authoritative reset time", async () => {
    const resetQuota = { ...quota, used: 5, remaining: 0, resets_at: "2000-01-01T00:00:00Z" };
    vi.mocked(sendAiChatMessage).mockRejectedValue(
      new AiQuotaError("Bạn đã sử dụng hết 5 lượt AI hôm nay.", resetQuota)
    );
    renderChatPanel();

    await submitQuestion();

    expect(await screen.findByText("Bạn đã sử dụng hết 5 lượt AI hôm nay.")).toBeVisible();
    await waitFor(() => expect(screen.getByRole("textbox")).toBeEnabled());
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Kiểm tra hạn mức mới" } });
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("keeps the quota label within the input region at a 390px viewport", async () => {
    vi.mocked(sendAiChatMessage).mockResolvedValue({
      message: { id: "ai-2", sender: "ai", timestamp: "Vừa xong", text: "Câu trả lời" },
      quota,
    });
    renderChatPanel();
    await submitQuestion();

    const inputRegion = await screen.findByLabelText("Khung nhập tin nhắn AI");
    const quotaLabel = within(inputRegion).getByLabelText("Hạn mức AI hôm nay");
    Object.defineProperty(inputRegion, "getBoundingClientRect", {
      configurable: true,
      value: () => controlledRect(16, 700, 358, 76),
    });
    Object.defineProperty(quotaLabel, "getBoundingClientRect", {
      configurable: true,
      value: () => controlledRect(109, 750, 172, 16),
    });

    const containerBounds = inputRegion.getBoundingClientRect();
    const labelBounds = quotaLabel.getBoundingClientRect();
    expect(containerBounds.width).toBe(358);
    expect(labelBounds.width).toBeGreaterThan(0);
    expect(labelBounds.left).toBeGreaterThanOrEqual(containerBounds.left);
    expect(labelBounds.right).toBeLessThanOrEqual(containerBounds.right);
  });
});
