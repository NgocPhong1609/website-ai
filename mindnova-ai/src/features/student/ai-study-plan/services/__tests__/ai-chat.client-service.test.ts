import { afterEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/src/shared/lib/axios";
import { sendAiChatMessage } from "../ai-chat.client-service";

const quota = {
  package: "free" as const,
  daily_limit: 5,
  used: 1,
  remaining: 4,
  resets_at: "2026-09-10T00:00:00+07:00",
};
const apiQuota = { allowed: true, ...quota };

describe("sendAiChatMessage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the AI message with the authoritative quota from a successful response", async () => {
    vi.spyOn(axiosClient, "post").mockResolvedValue({
      data: {
        success: true,
        message: "AI response generated successfully.",
        data: {
          id: "msg-ai-1",
          sender: "ai",
          timestamp: "Vừa xong",
          text: "Câu trả lời từ Nova",
        },
        meta: { quota: apiQuota },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    await expect(sendAiChatMessage("Giải thích bài này")).resolves.toEqual({
      message: {
        id: "msg-ai-1",
        sender: "ai",
        timestamp: "Vừa xong",
        text: "Câu trả lời từ Nova",
      },
      quota,
    });
  });

  it("remains compatible with successful responses that do not include quota metadata", async () => {
    vi.spyOn(axiosClient, "post").mockResolvedValue({
      data: {
        success: true,
        message: "AI response generated successfully.",
        data: {
          id: "msg-ai-legacy",
          sender: "ai",
          timestamp: "Vừa xong",
          text: "Phản hồi cũ",
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    await expect(sendAiChatMessage("Câu hỏi cũ")).resolves.toEqual({
      message: {
        id: "msg-ai-legacy",
        sender: "ai",
        timestamp: "Vừa xong",
        text: "Phản hồi cũ",
      },
      quota: undefined,
    });
  });

  it("preserves the backend 429 message and exposes its authoritative zero quota", async () => {
    const exhaustedQuota = { ...quota, used: 5, remaining: 0 };
    vi.spyOn(axiosClient, "post").mockRejectedValue(
      Object.assign(new Error("Request failed with status code 429"), {
        response: {
          status: 429,
          data: {
            message: "Bạn đã sử dụng hết 5 lượt AI hôm nay.",
            meta: { quota: { allowed: false, ...exhaustedQuota } },
          },
        },
      })
    );

    const error = await sendAiChatMessage("Thêm một câu hỏi").catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Bạn đã sử dụng hết 5 lượt AI hôm nay.");
    expect((error as Error & { quota?: typeof exhaustedQuota }).quota).toEqual(exhaustedQuota);
  });
});
