import { apiClient } from "@/src/shared/lib/api-client";
import type { DashboardOverview, DashboardApiResponse, DashboardCourse, AdvancedRecommendation } from "../types";

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
 console.warn("[DashboardService] Unable to reach backend /student/dashboard API:", error);
 }

 return {
 error: "Không thể tải bảng điều khiển. Vui lòng thử lại.",
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
