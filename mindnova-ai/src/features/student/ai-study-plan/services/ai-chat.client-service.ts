import type { AiChatApiResponse, AiChatMessage } from "../types";

/**
 * Sends a user message to the interactive AI Tutor backend service via client-side fetch.
 * Completely safe for usage inside React "use client" components (zero Node.js or Next headers dependencies).
 */
export async function sendAiChatMessage(
  message: string,
  history: AiChatMessage[] = [],
  lessonId?: number
): Promise<AiChatMessage> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
  const targetUrl = `${baseUrl.endsWith("/api") ? baseUrl : baseUrl + "/api"}/student/study-plan/chat`;

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      lesson_id: lessonId ?? null,
      history: history.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
    }),
  });

  if (!response.ok) {
    throw new Error(`[sendAiChatMessage] Request failed with status ${response.status}`);
  }

  const result: AiChatApiResponse = await response.json();
  if (result.success && result.data) {
    return result.data;
  }

  throw new Error(result.message || "Failed to parse AI Tutor response.");
}
