import { AdminUsersQuickActions } from "@/src/features/admin/components/AdminUsersQuickActions";
import { getAdminUsersPageData } from "@/src/features/admin/services/admin-users.service";

export async function AdminUsersPage() {
  const data = await getAdminUsersPageData();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.8)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">User Management</p>
            <h1 className="mt-2 text-2xl font-semibold">Quản lý người dùng</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Theo dõi tài khoản học viên, giảng viên và quyền truy cập trong hệ thống.
            </p>
          </div>

          <AdminUsersQuickActions />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Students</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.students.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Instructors</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.instructors.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Admins</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.admins.toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent accounts</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {data.rows.length} records
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={`${row.name}-${row.joined}`} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
