import { apiClient } from "@/src/shared/lib";
import type {
 AdminAiConfigData,
 AdminAnalyticsData,
 AdminContentData,
 AdminModerationData,
 AdminRevenueData,
 AdminTeacherApprovalData,
} from "@/src/features/admin/types";

type ApiEnvelope<T> = {
 data?: T;
};

export async function getTeacherApprovalsData(): Promise<AdminTeacherApprovalData> {
 const payload = await apiClient<ApiEnvelope<AdminTeacherApprovalData["rows"]>>("/admin/teacher-approvals");

 return {
 rows: (payload.data ?? []).map((row) => ({
 ...row,
 status: row.status ?? "pending",
 avatarUrl: row.avatarUrl ?? null,
 cvUrl: row.cvUrl ?? null,
 credentials: row.credentials ?? [],
 })),
 };
}

export async function getAdminAiSystemData(): Promise<AdminAiConfigData> {
 const payload = await apiClient<ApiEnvelope<AdminAiConfigData>>("/admin/ai-system");

 return payload.data ?? { providers: [], quotas: [], systemPrompts: [] };
}

export async function getAdminContentData(): Promise<AdminContentData> {
 const payload = await apiClient<ApiEnvelope<AdminContentData["rows"]>>("/admin/content");

 return {
 rows: payload.data ?? [],
 };
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
 const payload = await apiClient<ApiEnvelope<AdminAnalyticsData>>("/admin/analytics");

 return payload.data ?? { metrics: [], traffic: [], subjects: [], conversion: [] };
}

export async function getAdminRevenueData(): Promise<AdminRevenueData> {
  const payload = await apiClient<any>("/admin/revenue");
  const raw = payload?.data ?? payload ?? {};

  return {
    totalRevenue: raw.totalRevenue ?? 0,
    totalAdminRevenue: raw.totalAdminRevenue ?? 0,
    totalTeacherRevenue: raw.totalTeacherRevenue ?? 0,
    courseCount: raw.courseCount ?? 0,
    courses: raw.courses ?? [],
    orderHistory: raw.orderHistory ?? [],
  };
}

export async function getAdminModerationData(): Promise<AdminModerationData> {
 const payload = await apiClient<ApiEnvelope<AdminModerationData["rows"]>>("/admin/moderation-support");

 return {
 rows: payload.data ?? [],
 };
}
