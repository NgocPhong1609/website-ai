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
          className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{item.label}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              {item.trend}
            </span>
          </div>
          <div className="mt-5 text-3xl font-semibold text-slate-900">{item.value}</div>
          <div className="mt-2 text-sm text-slate-500">{item.note}</div>
        </article>
      ))}
    </section>
  );
}
