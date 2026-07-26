import { getAdminInvoicesPageData } from "@/src/features/admin/services/admin-invoices.service";

interface AdminInvoicesPageProps {
  filters?: {
    search?: string;
    status?: string;
    paymentMethod?: string;
  };
}

function toStatusLabel(status: string) {
  const value = status.toLowerCase();
  if (value.includes("completed")) return "Đã thanh toán";
  if (value.includes("failed")) return "Thất bại";
  if (value.includes("refund")) return "Hoàn tiền";
  return "Chờ thanh toán";
}

function toMethodLabel(method: string) {
  const value = method.toLowerCase();
  if (value === "vnpay") return "VNPay";
  if (value === "momo") return "MoMo";
  if (value === "stripe") return "Stripe";
  if (value === "banking") return "Chuyển khoản";
  return method;
}

function toStatusTone(status: string) {
  const value = status.toLowerCase();
  if (value.includes("completed")) return "bg-emerald-50 text-emerald-700";
  if (value.includes("failed")) return "bg-rose-100 text-rose-700";
  if (value.includes("refund")) return "bg-violet-100 text-violet-700";
  return "bg-amber-50 text-amber-700";
}

export async function AdminInvoicesPage({ filters }: AdminInvoicesPageProps) {
  const data = await getAdminInvoicesPageData(filters);

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0d1d3f_0%,#17386d_48%,#0f766e_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">Hóa đơn</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Danh sách hóa đơn</h1>
        <p className="mt-2 text-sm text-slate-200/90">Theo dõi tình trạng hóa đơn, phương thức thanh toán và tổng tiền đơn hàng.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <form method="GET" className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
            <span className="font-medium">Tìm kiếm</span>
            <input
              name="search"
              defaultValue={filters?.search}
              placeholder="Tên học viên, email, mã hóa đơn, tên khóa học"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Trạng thái</span>
            <select
              name="status"
              defaultValue={filters?.status}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="completed">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Hoàn tiền</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Phương thức</span>
            <select
              name="paymentMethod"
              defaultValue={filters?.paymentMethod}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            >
              <option value="">Tất cả</option>
              <option value="vnpay">VNPay</option>
              <option value="momo">MoMo</option>
              <option value="stripe">Stripe</option>
              <option value="banking">Chuyển khoản</option>
            </select>
          </label>

          <div className="md:col-span-4">
            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(79,70,229,0.9)] transition hover:from-cyan-400 hover:to-indigo-400">
              Áp dụng bộ lọc
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Hóa đơn gần đây</h2>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
            {data.rows.length} hóa đơn
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Mã hóa đơn</th>
                <th className="px-4 py-3 font-medium">Khóa học</th>
                <th className="px-4 py-3 font-medium">Học viên</th>
                <th className="px-4 py-3 font-medium">Số tiền</th>
                <th className="px-4 py-3 font-medium">Phương thức</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.transactionId || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <p className="max-w-[260px] truncate" title={row.courseTitle || "-"}>
                      {row.courseTitle || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <p className="font-medium text-slate-900">{row.studentName}</p>
                    <p className="text-xs text-slate-500">{row.studentEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.totalAmount.toLocaleString("vi-VN")} VND</td>
                  <td className="px-4 py-3 text-slate-700">{toMethodLabel(row.paymentMethod)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toStatusTone(row.status)}`}>
                      {toStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.createdAt}</td>
                </tr>
              ))}

              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Chưa có dữ liệu hóa đơn.
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
