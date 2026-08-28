import { apiClient } from "@/src/shared/lib";
import type { AdminCategoriesPageData } from "@/src/features/admin/types";

export async function getAdminCategoriesPageData(): Promise<AdminCategoriesPageData> {
 const payload = await apiClient<{ data?: Array<Record<string, unknown>> }>("/admin/categories");

 return {
 rows: (payload.data ?? []).map((row) => ({
 id: Number(row.id ?? 0),
 name: String(row.name ?? ""),
 slug: String(row.slug ?? ""),
 description: String(row.description ?? ""),
 status: String(row.status ?? "active"),
 })),
 };
}
