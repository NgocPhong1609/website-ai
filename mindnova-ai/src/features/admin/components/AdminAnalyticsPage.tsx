import { getAdminAnalyticsData } from "@/src/features/admin/services/admin-module-data.service";

export async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsData();

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/65">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Báo cáo & phân tích</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
          Theo dõi hiệu quả học viên, lưu lượng truy cập và tỷ lệ chuyển đổi theo thời gian.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{metric.value}</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">{metric.change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <h2 className="text-lg font-semibold text-slate-900">Traffic overview</h2>
          <div className="mt-4 flex h-44 items-end gap-3">
            {data.traffic.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-indigo-400" style={{ height: `${(point.value / 100) * 100}%` }} />
                <span className="text-[11px] text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <h2 className="text-lg font-semibold text-slate-900">Subject performance</h2>
          <div className="mt-4 space-y-3">
            {data.subjects.map((subject) => (
              <div key={subject.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{subject.label}</span>
                  <span>{subject.value}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${subject.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
