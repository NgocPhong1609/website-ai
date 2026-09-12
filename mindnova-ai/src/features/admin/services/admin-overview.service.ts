import { apiClient } from "@/src/shared/lib";
import type { AdminOverviewData } from "@/src/features/admin/types";

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  try {
    return await apiClient<AdminOverviewData>("/admin/overview", { cache: "no-store" });
  } catch (error) {
    console.warn("[AdminOverviewService] Failed to fetch admin overview data:", error);
    return {
      error: "Không thể tải tổng quan. Vui lòng tải lại trang để thử lại.",
      hero: {
        title: "Tổng quan quản trị",
        description: "Theo dõi người dùng, khóa học và doanh thu.",
        primaryAction: "Quản lý nội dung",
        secondaryAction: "Xem báo cáo",
      },
      stats: [],
      activities: [],
      health: [],
      users: [],
      quickActions: [],
    };
  }
}
