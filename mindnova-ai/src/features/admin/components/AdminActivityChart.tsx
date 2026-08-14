import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminActivityChartProps {
  activities: AdminOverviewData["activities"];
}

export function AdminActivityChart({ activities }: AdminActivityChartProps) {
  const values = activities.map((item) => item.value);
  const maxValue = Math.max(...values, 100);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const points = activities
    .map((item, index) => {
      const x = (index / Math.max(activities.length - 1, 1)) * 100;
      const y = 100 - ((item.value - minValue) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_48px_-30px_rgba(15,23,42,0.5)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
            Biểu đồ hoạt động
          </h2>
          <p className="text-sm text-slate-500">Tổng quan theo 7 ngày gần nhất</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          +12.4% so với tuần trước
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[260px] w-full">
            <defs>
              <linearGradient id="activityLine" x1="0" x2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="45%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.28)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((line) => (
              <line
                key={line}
                x1="0"
                x2="100"
                y1={line}
                y2={line}
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="0.6"
              />
            ))}

            <polyline
              points={`0,100 ${points} 100,100`}
              fill="url(#activityFill)"
              stroke="none"
            />

            <polyline
              points={points}
              fill="none"
              stroke="url(#activityLine)"
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {activities.map((item, index) => {
              const x = (index / Math.max(activities.length - 1, 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 80 - 10;

              return (
                <g key={item.label}>
                  <circle cx={x} cy={y} r="2.8" fill="#fff" stroke="#2563eb" strokeWidth="1.2" />
                  <text x={x} y="100" textAnchor="middle" fontSize="4" fill="#64748b" dy="6">
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {activities.slice(-3).map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{item.label}</span>
                <span className="font-semibold text-slate-700">{item.value}</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500"
                  style={{ width: `${Math.min((item.value / maxValue) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
