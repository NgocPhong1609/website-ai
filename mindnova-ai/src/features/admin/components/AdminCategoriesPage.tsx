import { AdminCategoriesQuickActions } from "@/src/features/admin/components/AdminCategoriesQuickActions";
import { getAdminCategoriesPageData } from "@/src/features/admin/services/admin-categories.service";
import { AdminCategoriesQuickActions } from "@/src/features/admin/components/AdminCategoriesQuickActions";

export async function AdminCategoriesPage() {
  const data = await getAdminCategoriesPageData();

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#10223f_0%,#0f3f5f_50%,#0f766e_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">Danh mục khóa học</p>
          <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Kiểm duyệt danh mục khóa học</h1>
          <p className="mt-2 text-sm text-slate-200/90">Theo dõi trạng thái danh mục để đảm bảo nội dung hiển thị đúng tiêu chuẩn kiểm duyệt.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Danh sách danh mục</h2>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">{data.rows.length} danh mục</span>
        </div>
<<<<<<< HEAD

        <div className="mb-4">
          <AdminCategoriesQuickActions />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Tên</th>
                <th className="px-4 py-3 font-medium">Định danh</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{toStatusLabel(row.status)}</span>
                  </td>
                </tr>
              ))}

              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Chưa có dữ liệu danh mục.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
=======
        <AdminCategoriesQuickActions rows={data.rows} />
>>>>>>> origin/main
      </section>
    </div>
  );
}
