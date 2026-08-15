import { getAdminModerationData } from "@/src/features/admin/services/admin-module-data.service";

export async function AdminModerationPage() {
  const data = await getAdminModerationData();

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/65">Moderation & support</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Kiểm duyệt & hỗ trợ</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
          Theo dõi báo cáo vi phạm, yêu cầu hỗ trợ và xử lý sự cố nội dung trước khi ảnh hưởng đến người dùng.
        </p>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Loại</th>
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium">Người báo cáo</th>
                <th className="px-4 py-3 font-medium">Mức độ</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                  <td className="px-4 py-3 text-slate-600">{item.type}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.reporter}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.severity === "high" ? "bg-rose-100 text-rose-700" : item.severity === "medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "open" ? "bg-sky-50 text-sky-700" : item.status === "in_review" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {item.status === "open" ? "Mở" : item.status === "in_review" ? "Đang xem xét" : "Đã giải quyết"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
