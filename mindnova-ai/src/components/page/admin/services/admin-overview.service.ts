import { apiClient } from "@/src/lib";
import type { AdminOverviewData } from "@/src/features/admin/types";

const fallbackData: AdminOverviewData = {
  hero: {
    title: "Xin chào, Admin",
    description:
      "Trang quản trị để bạn nối dữ liệu từ Laravel backend và quản lý người dùng, khóa học, thống kê và hoạt động hệ thống.",
    primaryAction: "Thêm mới",
    secondaryAction: "Xuất báo cáo",
  },
  stats: [
    {
      label: "Tổng người dùng",
      value: "12.480",
      trend: "+8.2%",
      note: "so với tháng trước",
    },
    {
      label: "Khóa học đang hoạt động",
      value: "184",
      trend: "+14",
      note: "mới cập nhật",
    },
    {
      label: "Doanh thu",
      value: "$48.2K",
      trend: "+12.6%",
      note: "tổng doanh số",
    },
    {
      label: "Tỉ lệ hoàn thành",
      value: "76%",
      trend: "+4.1%",
      note: "độ hài lòng học viên",
    },
  ],
  activities: [
    { label: "T1", value: 48 },
    { label: "T2", value: 78 },
    { label: "T3", value: 62 },
    { label: "T4", value: 95 },
    { label: "T5", value: 88 },
    { label: "T6", value: 110 },
    { label: "T7", value: 130 },
  ],
  health: [
    { title: "API Laravel", status: "Healthy", color: "bg-emerald-500" },
    { title: "Queue Jobs", status: "Stable", color: "bg-cyan-500" },
    { title: "Storage", status: "Warning", color: "bg-amber-500" },
    { title: "AI Service", status: "Healthy", color: "bg-violet-500" },
  ],
  users: [
    { name: "Nguyễn Minh Anh", role: "Student", status: "Active" },
    { name: "Trần Quốc Bảo", role: "Instructor", status: "Pending" },
    { name: "Lê Hoàng Nam", role: "Admin", status: "Active" },
    { name: "Phạm Yến Nhi", role: "Student", status: "Inactive" },
  ],
  quickActions: [
    "Quản lý khóa học",
    "Quản lý người dùng",
    "Báo cáo doanh thu",
    "Cấu hình hệ thống",
  ],
};

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  try {
    return await apiClient<AdminOverviewData>("/admin/overview");
  } catch {
    return fallbackData;
  }
}
