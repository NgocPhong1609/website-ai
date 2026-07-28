import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminRecentUsersTableProps {
  users: AdminOverviewData["users"];
}

export function AdminRecentUsersTable({ users }: AdminRecentUsersTableProps) {
  const toRoleLabel = (role: string) => {
    const value = role.toLowerCase();
    if (value.includes("admin")) return "Quản trị viên";
    if (value.includes("instructor") || value.includes("teacher")) return "Giảng viên";
    if (value.includes("student")) return "Học viên";
    return role;
  };

  const toStatusLabel = (status: string) => {
    const value = status.toLowerCase();
    if (value.includes("active")) return "Đang hoạt động";
    if (value.includes("pending")) return "Chờ duyệt";
    if (value.includes("inactive")) return "Ngưng hoạt động";
    if (value.includes("banned") || value.includes("ban")) return "Đã khóa";
    return status;
  };

  const statusTone = (status: string) => {
    const value = status.toLowerCase();
    if (value.includes("active") || value.includes("hoạt động")) return "bg-emerald-50 text-emerald-700";
    if (value.includes("pending") || value.includes("chờ duyệt")) return "bg-amber-50 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <article className="mn-stagger rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Người dùng gần đây</h2>
          <p className="text-sm text-slate-500">Danh sách thao tác mới nhất</p>
        </div>
        <button className="rounded-full border border-cyan-100 bg-cyan-50/70 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">
          Xem tất cả
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Tên</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={`${user.name}-${index}`} className="border-t border-slate-200 bg-white/90 hover:bg-cyan-50/35">
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{toRoleLabel(user.role)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(user.status)}`}>
                    {toStatusLabel(user.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
