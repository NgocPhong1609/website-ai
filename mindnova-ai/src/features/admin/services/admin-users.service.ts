import { apiClient } from "@/src/shared/lib";
import type { AdminUsersPageData } from "@/src/features/admin/types";

export async function getAdminUsersPageData(): Promise<AdminUsersPageData> {
  const payload = await apiClient<{ data?: Array<Record<string, unknown>>; total?: number }>("/admin/users");

  const rows = (payload.data ?? []).map((row: Record<string, unknown>) => ({
    id: Number(row.id ?? 0),
    name: String(row.name ?? "Người dùng chưa xác định"),
    role: String(
      (row.role as string | undefined) ??
        ((row.roles as Array<{ name?: string }> | undefined)?.[0]?.name ?? "student")
    ),
    status: String((row.status as string | undefined) ?? "active"),
    joined: String((row.created_at as string | undefined) ?? "—"),
    isLocked: Boolean(row.is_locked ?? false),
  }));

  return {
    summary: {
      students: rows.filter((row) => row.role.toLowerCase().includes("student")).length,
      instructors: rows.filter((row) => row.role.toLowerCase().includes("instructor") || row.role.toLowerCase().includes("teacher")).length,
      admins: rows.filter((row) => row.role.toLowerCase().includes("admin")).length,
    },
    rows,
  };
}
