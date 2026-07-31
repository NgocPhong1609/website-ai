import { apiClient } from "@/src/lib";
import type { AdminOverviewData } from "@/src/features/admin/types";

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  return apiClient<AdminOverviewData>("/admin/overview");
}
