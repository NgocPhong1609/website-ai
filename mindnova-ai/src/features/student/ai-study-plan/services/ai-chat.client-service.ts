import { axiosClient } from "@/src/shared/lib/axios";
import type { AiChatApiResponse, AiChatMessage } from "../types";

/**
 * Sends a user message to the interactive AI Tutor backend service via axiosClient.
 * Safe for client-side components with automatic authentication and relative API path resolution.
 */
export async function sendAiChatMessage(
  message: string,
  history: AiChatMessage[] = [],
  lessonId?: number
): Promise<AiChatMessage> {
  try {
    const res = await axiosClient.post("/api/student/study-plan/chat", {
      message,
      lesson_id: lessonId ?? null,
      history: history.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
    });

    const result: AiChatApiResponse = res.data;
    if (result && result.success && result.data) {
      return result.data;
    }

    throw new Error(
      result?.message || "⏳ **Gia sư Nova đang bận xíu, bạn vui lòng chờ khoảng 1 phút rồi gửi lại tin nhắn cho mình nhé!** 😊"
    );
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        throw new Error("⏳ **Gia sư Nova hiện đang bận xíu hoặc bạn đã gửi câu hỏi quá nhanh (> 5 câu/phút). Bạn vui lòng chờ khoảng 1 phút rồi thử đặt câu hỏi lại nhé!** 😊");
      }
      if (status === 401) {
        throw new Error("🔑 **Phiên đăng nhập đã hết hạn. Bạn vui lòng đăng nhập lại để trò chuyện với Gia sư Nova nhé!**");
      }
      if (status === 403) {
        throw new Error("⛔ **Bạn chưa có quyền truy cập tính năng Gia sư AI này.**");
      }
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`⏳ **Gia sư Nova hiện đang bận xíu (lỗi máy chủ ${status}), bạn vui lòng chờ khoảng 1 phút rồi thử lại nhé!** 😊`);
    }

    if (error.request) {
      throw new Error("📡 **Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng của bạn và thử lại.**");
    }

    throw error;
  }
}
