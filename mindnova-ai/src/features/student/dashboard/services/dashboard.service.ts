import { cookies } from "next/headers";
import { isUnauthorizedError } from "@/src/shared/lib/user-error";
import { apiClient } from "@/src/shared/lib/api-client";
import type { DashboardOverview, DashboardApiResponse, DashboardCourse, AdvancedRecommendation } from "../types";

function emptyDashboard(error?: string, sessionExpired = false): DashboardOverview {
  return {
    ...(error ? { error } : {}),
    ...(sessionExpired ? { session_expired: true } : {}),
    user: null,
    courses: [],
    focus_areas: [],
    ai_suggestion: { badge: "", message: "", reason: "", estimated: "" },
    overall_progress: { percent: 0, delta: "" },
    study_streak: { days: 0, message: "" },
    advanced_recommendations: [],
    weekly_activity: { T2: false, T3: false, T4: false, T5: false, T6: false, T7: false, CN: false },
    checked_in_dates: [],
  };
}

/**
 * Normalizes course attributes between API snake_case format and local camelCase format.
 */
function normalizeCourse(course: DashboardCourse): DashboardCourse {
  return {
    ...course,
    nextLesson: course.next_lesson ?? course.nextLesson ?? "Continue Course",
    thumbnailUrl: course.thumbnail_url ?? course.thumbnailUrl,
    thumbnailGradient: course.thumbnail_gradient ?? course.thumbnailGradient,
  };
}

function normalizeRecommendation(rec: AdvancedRecommendation): AdvancedRecommendation {
  return {
    ...rec,
    studentsCount: rec.students_count ?? rec.studentsCount ?? 0,
    thumbnailUrl: rec.thumbnail_url ?? rec.thumbnailUrl,
    aiMatch: rec.ai_match ?? rec.aiMatch ?? "Recommended Track",
  };
}

/**
 * Fetches dashboard overview stats directly in React Server Components (RSC).
 * Implements Next.js caching and revalidating per checklist.md Rule #4.
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return emptyDashboard();
  }

  try {
    // Fetch directly from Server Component with no-store to prevent global caching
    const response = await apiClient<DashboardApiResponse>("/student/dashboard", {
      cache: "no-store",
    } as RequestInit);

    if (response?.success && response?.data) {
      return {
        ...response.data,
        courses: (response.data.courses || []).map(normalizeCourse),
        advanced_recommendations: (response.data.advanced_recommendations || []).map(normalizeRecommendation),
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized (401)")) {
      return emptyDashboard("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", true);
    }
    // Fallback error check if needed
    if (isUnauthorizedError(error)) {
      return emptyDashboard("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", true);
    }

    console.warn("[DashboardService] Unable to reach backend /student/dashboard API:", error);
  }

  return emptyDashboard("Không thể tải bảng điều khiển. Vui lòng thử lại.");
}