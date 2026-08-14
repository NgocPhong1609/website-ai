import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminStatsGridProps {
  stats: AdminOverviewData["stats"];
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.7)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(14,165,233,0.4)]"
        >
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{item.label}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
              {item.trend}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="text-[30px] font-semibold leading-none text-slate-900 [font-family:var(--font-admin-head)]">
              {item.value}
            </div>
            <div className="flex h-10 w-16 items-end gap-1 rounded-xl bg-slate-100 p-2">
              {[28, 40, 32, 48, 36, 60, 50].map((height, index) => (
                <span
                  key={`${item.label}-${index}`}
                  className="w-full rounded-t-md bg-gradient-to-t from-cyan-500 to-indigo-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">{item.note}</div>
        </article>
      ))}
    </section>
  );
}
