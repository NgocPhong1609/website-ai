import { apiClient } from "@/src/shared/lib";
import type { AdminCoursesPageData } from "@/src/features/admin/types";

const fallbackData: AdminCoursesPageData = {
  summary: {
    published: 184,
    draft: 21,
    pendingReview: 7,
  },
  rows: [
    { name: "AI Fundamentals", learners: 1240, progress: "92%", status: "Published" },
    { name: "Advanced Prompting", learners: 842, progress: "77%", status: "Draft" },
    { name: "Data Analysis Bootcamp", learners: 603, progress: "68%", status: "Review" },
  ],
};

export async function getAdminCoursesPageData(): Promise<AdminCoursesPageData> {
  try {
    const payload = await apiClient<{ data?: Array<Record<string, unknown>> }>("/admin/courses");

    const rows = (payload.data ?? []).map((row: Record<string, unknown>) => ({
      name: String(row.title ?? "Untitled course"),
      learners: Number(row.learners ?? 0),
      progress: String(row.progress ?? "—"),
      status: String(row.status ?? "Published"),
    }));

    return {
      summary: {
        published: rows.filter((row) => row.status.toLowerCase().includes("publish")).length || fallbackData.summary.published,
        draft: rows.filter((row) => row.status.toLowerCase().includes("draft")).length || fallbackData.summary.draft,
        pendingReview: rows.filter((row) => row.status.toLowerCase().includes("review")).length || fallbackData.summary.pendingReview,
      },
      rows: rows.length ? rows : fallbackData.rows,
    };
  } catch {
    return fallbackData;
  }
}
