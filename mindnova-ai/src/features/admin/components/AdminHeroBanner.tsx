import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminHeroBannerProps {
  hero: AdminOverviewData["hero"];
}

export function AdminHeroBanner({ hero }: AdminHeroBannerProps) {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.8)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-300">
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{hero.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">{hero.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
            {hero.secondaryAction}
          </button>
          <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            {hero.primaryAction}
          </button>
        </div>
      </div>
    </section>
  );
}
