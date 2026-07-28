import { AdminUserModerationButton } from "@/src/features/admin/components/AdminUserModerationButton";
import { getAdminUsersPageData } from "@/src/features/admin/services/admin-users.service";

export async function AdminUsersPage() {
  const data = await getAdminUsersPageData();

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
    return "bg-rose-100 text-rose-700";
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/65">Kiểm duyệt người dùng</p>
          <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Quản lý kiểm duyệt người dùng</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
            Theo dõi trạng thái tài khoản học viên, giảng viên và xử lý kiểm duyệt quyền truy cập.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Học viên</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.students.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Giảng viên</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.instructors.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Quản trị viên</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.admins.toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Tài khoản gần đây</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {data.rows.length} bản ghi
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Tên</th>
                <th className="px-4 py-3 font-medium">Vai trò</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày tham gia</th>
                <th className="px-4 py-3 font-medium">Kiểm duyệt</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={`${row.id}-${row.joined}`} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{toRoleLabel(row.role)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(row.status)}`}>
                      {toStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.joined}</td>
                  <td className="px-4 py-3">
                    <AdminUserModerationButton userId={row.id} initialStatus={row.status} />
                  </td>
                </tr>
              ))}

              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Chưa có dữ liệu người dùng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
