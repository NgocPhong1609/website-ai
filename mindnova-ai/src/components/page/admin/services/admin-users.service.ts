import { apiClient } from "@/src/lib";
import type { AdminUsersPageData } from "@/src/features/admin/types";

const fallbackData: AdminUsersPageData = {
  summary: {
    students: 8420,
    instructors: 324,
    admins: 18,
  },
  rows: [
    { name: "Nguyễn Minh Anh", role: "Student", status: "Active", joined: "12 Jan 2026" },
    { name: "Trần Quốc Bảo", role: "Instructor", status: "Pending", joined: "24 Feb 2026" },
    { name: "Lê Hoàng Nam", role: "Admin", status: "Active", joined: "08 Mar 2026" },
    { name: "Phạm Yến Nhi", role: "Student", status: "Inactive", joined: "19 Mar 2026" },
    { name: "Đỗ Thu Hương", role: "Student", status: "Active", joined: "03 Apr 2026" },
  ],
};

export async function getAdminUsersPageData(): Promise<AdminUsersPageData> {
  try {
    const payload = await apiClient<{ data?: Array<Record<string, unknown>>; total?: number }>("/admin/users");

    const rows = (payload.data ?? []).map((row: Record<string, unknown>) => ({
      name: String(row.name ?? "Unknown user"),
      role: String((row.role as string | undefined) ?? (row.roles as string[] | undefined)?.[0] ?? "User"),
      status: String((row.status as string | undefined) ?? "Active"),
      joined: String((row.created_at as string | undefined) ?? "—"),
    }));

    return {
      summary: {
        students: rows.filter((row) => row.role.toLowerCase().includes("student")).length || fallbackData.summary.students,
        instructors: rows.filter((row) => row.role.toLowerCase().includes("instructor") || row.role.toLowerCase().includes("teacher")).length || fallbackData.summary.instructors,
        admins: rows.filter((row) => row.role.toLowerCase().includes("admin")).length || fallbackData.summary.admins,
      },
      rows: rows.length ? rows : fallbackData.rows,
    };
  } catch {
    return fallbackData;
  }
}
