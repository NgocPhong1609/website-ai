import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminHeroBannerProps {
  hero: AdminOverviewData["hero"];
}

export function AdminHeroBanner({ hero }: AdminHeroBannerProps) {
  return (
    <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0c1837_0%,#122552_48%,#4f46e5_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
            Bảng điều khiển quản trị
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight [font-family:var(--font-admin-head)]">{hero.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200/90">{hero.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
            {hero.secondaryAction}
          </button>
          <button className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#0a1d3d] shadow-[0_10px_24px_-12px_rgba(34,211,238,0.85)] transition hover:bg-cyan-200">
            {hero.primaryAction}
          </button>
        </div>
      </div>
    </section>
  );
}
