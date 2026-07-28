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
          className="mn-stagger rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_45px_-26px_rgba(14,23,52,0.55)]"
        >
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{item.label}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">
              {item.trend}
            </span>
          </div>
          <div className="mt-5 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{item.value}</div>
          <div className="mt-2 text-sm text-slate-500">{item.note}</div>
        </article>
      ))}
    </section>
  );
}
