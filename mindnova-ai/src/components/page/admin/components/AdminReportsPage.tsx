const reportBars = [48, 72, 64, 88, 96, 110, 132];

export function AdminReportsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[28px] bg-gradient-to-r from-emerald-600 to-cyan-500 p-6 text-white shadow-[0_20px_60px_-25px_rgba(16,185,129,0.8)]">
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="mt-2 text-sm text-white/80">
          Theo dõi doanh thu, hiệu suất và các KPI của hệ thống.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">$48.2K</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Retention</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">76%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Satisfaction</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">92%</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Weekly activity</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live metrics
          </span>
        </div>

        <div className="grid grid-cols-7 items-end gap-3">
          {reportBars.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-600 to-cyan-400"
                style={{ height: `${value}px` }}
              />
              <span className="text-xs text-slate-500">T{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
