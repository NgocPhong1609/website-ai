import { AdminCouponQuickActions } from "@/src/features/admin/components/AdminCouponQuickActions";
import { getAdminCouponsPageData } from "@/src/features/admin/services/admin-coupons.service";

export async function AdminCouponsPage() {
  const data = await getAdminCouponsPageData();

  const toDiscountText = (type: string, value: number) => {
    if (type === "percent") return `${Math.round(value)}%`;
    return `${Math.round(value).toLocaleString("vi-VN")} VNĐ`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "";
    }
  };

  const formatTimeRange = (startsAt?: string | null, expiresAt?: string | null) => {
    const start = formatDate(startsAt);
    const end = formatDate(expiresAt);
    if (start && end) return `${start} - ${end}`;
    if (start) return `Từ ${start}`;
    if (end) return `Đến ${end}`;
    return "Không giới hạn";
  };

  return (
    <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-2xl border border-white/20 bg-[linear-gradient(125deg,#0f1a3c_0%,#183067_45%,#0f766e_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">Mã giảm giá</p>
          <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Quản lý mã giảm giá khóa học</h1>
          <p className="mt-1 text-xs text-slate-200/90">Tạo và quản lý các ưu đãi áp dụng cho quảng bá và nâng cao tỷ lệ thanh toán khóa học.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Danh sách mã giảm giá</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">{data.rows.length} mã</span>
        </div>

        <div className="mb-4">
          <AdminCouponQuickActions />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Mã</th>
                <th className="px-4 py-3 font-medium">Giảng viên</th>
                <th className="px-4 py-3 font-medium">Mức giảm</th>
                <th className="px-4 py-3 font-medium">Khóa học áp dụng</th>
                <th className="px-4 py-3 font-medium">Thời gian áp dụng</th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.rows.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-emerald-50/35">
                  <td className="px-4 py-3 font-mono font-bold text-sky-700">{row.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.teacherName}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-700">{toDiscountText(row.discountType, row.value)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.courseTitle ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold">
                        {row.courseTitle}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        Áp dụng cho tất cả
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700">
                    {formatTimeRange(row.startsAt, row.expiresAt)}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {row.usedCount}/{row.maxUses || "∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                      {row.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </td>
                </tr>
              ))}

              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
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
