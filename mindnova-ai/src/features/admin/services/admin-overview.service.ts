import { apiClient } from "@/src/shared/lib";
import type { AdminOverviewData } from "@/src/features/admin/types";

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  try {
    return await apiClient<AdminOverviewData>("/admin/overview");
  } catch (error) {
    console.warn("[AdminOverviewService] Failed to fetch admin overview data:", error);
    return {
      metrics: [],
      activities: [],
    } as unknown as AdminOverviewData;
  }
}
