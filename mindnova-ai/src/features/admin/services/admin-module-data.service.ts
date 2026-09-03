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
  try {
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
  } catch (error) {
    console.warn("[AdminService] Failed to fetch teacher approvals data:", error);
    return { rows: [] };
  }
}

export async function getAdminAiSystemData(): Promise<AdminAiConfigData> {
  try {
    const payload = await apiClient<ApiEnvelope<AdminAiConfigData>>("/admin/ai-system");

    return payload.data ?? { providers: [], quotas: [], systemPrompts: [] };
  } catch (error) {
    console.warn("[AdminService] Failed to fetch AI system data:", error);
    return { providers: [], quotas: [], systemPrompts: [] };
  }
}

export async function getAdminContentData(): Promise<AdminContentData> {
  try {
    const payload = await apiClient<ApiEnvelope<AdminContentData["rows"]>>("/admin/content");

    return {
      rows: payload.data ?? [],
    };
  } catch (error) {
    console.warn("[AdminService] Failed to fetch admin content data:", error);
    return { rows: [] };
  }
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  try {
    const payload = await apiClient<ApiEnvelope<AdminAnalyticsData>>("/admin/analytics");

    return payload.data ?? { metrics: [], traffic: [], subjects: [], conversion: [] };
  } catch (error) {
    console.warn("[AdminService] Failed to fetch admin analytics data:", error);
    return { metrics: [], traffic: [], subjects: [], conversion: [] };
  }
}

export async function getAdminRevenueData(): Promise<AdminRevenueData> {
  try {
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
  } catch (error) {
    console.warn("[AdminService] Failed to fetch admin revenue data:", error);
    return {
      totalRevenue: 0,
      totalAdminRevenue: 0,
      totalTeacherRevenue: 0,
      courseCount: 0,
      courses: [],
      orderHistory: [],
    };
  }
}

export async function getAdminModerationData(): Promise<AdminModerationData> {
  try {
    const payload = await apiClient<ApiEnvelope<AdminModerationData["rows"]>>("/admin/moderation-support");

    return {
      rows: payload.data ?? [],
    };
  } catch (error) {
    console.warn("[AdminService] Failed to fetch admin moderation data:", error);
    return { rows: [] };
  }
}
