import { getErrorMessage } from "@/src/shared/lib/user-error";
import { axiosClient } from "@/src/shared/lib/axios";
import type { AiChatApiResponse, AiChatMessage, AiChatResult, AiQuotaMeta } from "../types";

// Match AiChatRequest's max:2000 (Laravel counts Unicode code points).
const HISTORY_TEXT_LIMIT = 2000;

export class AiQuotaError extends Error {
 constructor(message: string, public readonly quota?: AiQuotaMeta) {
  super(message);
  this.name = "AiQuotaError";
 }
}

function parseQuota(quota?: AiQuotaMeta): AiQuotaMeta | undefined {
 if (!quota) return undefined;
 return {
  package: quota.package,
  daily_limit: quota.daily_limit,
  used: quota.used,
  remaining: quota.remaining,
  resets_at: quota.resets_at,
 };
}

/**
 * Sends a user message to the interactive AI Tutor backend service via axiosClient.
 * Safe for client-side components with automatic authentication and relative API path resolution.
 */
export async function sendAiChatMessage(
 message: string,
 history: AiChatMessage[] = [],
 lessonId?: number
): Promise<AiChatResult> {
 try {
 const res = await axiosClient.post("/api/student/study-plan/chat", {
 message,
 lesson_id: lessonId ?? null,
 history: history.slice(-4).map((m) => ({
  sender: m.sender,
  text: Array.from(m.text).slice(0, HISTORY_TEXT_LIMIT).join(""),
 })),
 });

 const result: AiChatApiResponse = res.data;
 if (result && result.success && result.data) {
 return { message: result.data, quota: parseQuota(result.meta?.quota) };
 }

 throw new Error(getErrorMessage(result, "Chưa thể nhận phản hồi từ gia sư AI. Vui lòng thử lại sau."));
 } catch (error: any) {
 const message = getErrorMessage(error, "Chưa thể nhận phản hồi từ gia sư AI. Vui lòng thử lại sau.");
 if (error.response?.status === 429) {
   throw new AiQuotaError(message, parseQuota(error.response.data?.meta?.quota));
 }
 throw new Error(message);
 }
}
