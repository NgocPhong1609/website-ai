import { AdminCouponQuickActions } from "@/src/features/admin/components/AdminCouponQuickActions";
import { getAdminCouponsPageData } from "@/src/features/admin/services/admin-coupons.service";

export async function AdminCouponsPage() {
  const data = await getAdminCouponsPageData();

  const toDiscountText = (type: string, value: number) => {
    if (type === "percent") return `${value}%`;
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-2xl border border-cyan-200/20 bg-[linear-gradient(125deg,#0f1a3c_0%,#183067_45%,#0f766e_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/70">Mã giảm giá</p>
          <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Quản lý mã giảm giá khóa học</h1>
          <p className="mt-1 text-xs text-slate-200/90">Tạo và quản lý các ưu đãi áp dụng cho quảng bá và nâng cao tỷ lệ thanh toán khóa học.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Danh sách mã giảm giá</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">{data.rows.length} mã</span>
        </div>

        <div className="mb-4">
          <AdminCouponQuickActions />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Mã</th>
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium">Giảm</th>
                <th className="px-4 py-3 font-medium">Khóa học</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-emerald-50/35">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.code}</td>
                  <td className="px-4 py-3 text-slate-700">{row.title}</td>
                  <td className="px-4 py-3 text-slate-700">{toDiscountText(row.discountType, row.value)}</td>
                  <td className="px-4 py-3 text-slate-600">{row.courseTitle || "Áp dụng cho tất cả"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {row.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </td>
                </tr>
              ))}

              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Chưa có mã giảm giá nào.
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
