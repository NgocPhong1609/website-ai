import { apiClient } from "@/src/shared/lib";
import type { AdminCoursesPageData } from "@/src/features/admin/types";

type CourseApiPayload = {
 data?: Array<{
 id?: number;
 title?: string;
 description?: string;
 category_id?: number | null;
 category?: { name?: string } | null;
 level?: string;
 price?: number | string;
 status?: string;
 }>;
};

type CategoryApiPayload = {
 data?: Array<{ id?: number; name?: string }>;
};

export async function getAdminCoursesPageData(params?: {
 search?: string;
 categoryId?: string;
 level?: string;
}): Promise<AdminCoursesPageData> {
 const query = new URLSearchParams();

 if (params?.search) {
 query.set("search", params.search);
 }
 if (params?.categoryId) {
 query.set("category_id", params.categoryId);
 }
 if (params?.level) {
 query.set("level", params.level);
 }

 const suffix = query.toString() ? `?${query.toString()}` : "";

 const [coursePayload, categoryPayload] = await Promise.all([
 apiClient<CourseApiPayload>(`/admin/courses${suffix}`),
 apiClient<CategoryApiPayload>("/admin/categories"),
 ]);

 const rows = (coursePayload.data ?? []).map((row) => ({
 id: Number(row.id ?? 0),
 title: String(row.title ?? "Khóa học chưa có tiêu đề"),
 description: String(row.description ?? ""),
 categoryId: row.category_id ? Number(row.category_id) : null,
 category: String(row.category?.name ?? "Chưa phân loại"),
 level: String(row.level ?? "beginner"),
 price: Number(row.price ?? 0),
 status: String(row.status ?? "draft"),
 }));

 const categories = (categoryPayload.data ?? []).map((category) => ({
 id: Number(category.id ?? 0),
 name: String(category.name ?? "Chưa đặt tên"),
 }));

 return {
 summary: {
 published: rows.filter((row) => row.status.toLowerCase().includes("publish")).length,
 draft: rows.filter((row) => row.status.toLowerCase().includes("draft")).length,
 pendingReview: rows.filter((row) => row.status.toLowerCase().includes("review")).length,
 },
 filters: {
 search: params?.search ?? "",
 categoryId: params?.categoryId ?? "",
 level: params?.level ?? "",
 categories,
 },
 rows,
 };
}
