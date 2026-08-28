import { apiClient } from "@/src/shared/lib/api-client";
import type { DashboardOverview, DashboardApiResponse, DashboardCourse, AdvancedRecommendation } from "../types";
import { AI_SUGGESTION, DASHBOARD_COURSES, FOCUS_AREAS, OVERALL_PROGRESS, STUDY_STREAK, ADVANCED_RECOMMENDATIONS } from "../constants";

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
 advanced_recommendations: (response.data.advanced_recommendations || ADVANCED_RECOMMENDATIONS as unknown as AdvancedRecommendation[]).map(normalizeRecommendation),
 };
 }
 } catch (error) {
 // Graceful fallback if backend API server is unreachable during local development
 console.warn("[DashboardService] Unable to reach backend /student/dashboard API, using local fallback:", error);
 require('fs').appendFileSync('error.log', String(error) + '\n');
 }

 return {
 user: null,
 courses: (DASHBOARD_COURSES as unknown as DashboardCourse[]).map(normalizeCourse),
 focus_areas: FOCUS_AREAS,
 ai_suggestion: { ...AI_SUGGESTION },
 overall_progress: { ...OVERALL_PROGRESS },
 study_streak: { ...STUDY_STREAK },
 advanced_recommendations: (ADVANCED_RECOMMENDATIONS as unknown as AdvancedRecommendation[]).map(normalizeRecommendation),
 };
}
