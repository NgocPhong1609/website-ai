"use client";

import type { AdminOverviewData } from "@/src/features/admin/types";
import { useRouter } from "next/navigation";

interface AdminHeroBannerProps {
  hero: AdminOverviewData["hero"];
  stats?: AdminOverviewData["stats"];
}

export function AdminHeroBanner({ hero, stats = [] }: AdminHeroBannerProps) {
  const router = useRouter();
  const title = hero?.title ?? "Bảng điều khiển MindNova";
  const description = hero?.description ?? "Theo dõi người dùng, nội dung và hệ thống trên cùng một palette xanh với student.";
  const primaryAction = hero?.primaryAction ?? "Quản lý khóa học";
  const secondaryAction = hero?.secondaryAction ?? "Xem báo cáo";

  const handleSecondaryAction = () => {
    router.push("/admin/analytics");
  };

  const handlePrimaryAction = () => {
    router.push("/admin/content");
  };

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] py-4 px-5 lg:py-5 lg:px-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#3B82F6]">
            Bảng điều khiển quản trị
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#0F172A] md:text-4xl [font-family:var(--font-sans)]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#475569]">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSecondaryAction}
            className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition hover:border-[#3B82F6] hover:text-[#2563EB]"
          >
            {secondaryAction}
          </button>
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.85)] transition hover:bg-[#2563EB]"
          >
            {primaryAction}
          </button>
        </div>
      </div>

      {(() => {
        const metrics = [
          stats.find((item) => item.label.toLowerCase().includes("doanh thu")),
          stats.find((item) => item.label.toLowerCase().includes("khóa học")),
          stats.find((item) => item.label.toLowerCase().includes("hoàn thành")),
        ].filter((item): item is NonNullable<typeof item> => Boolean(item));
        const display = metrics.length ? metrics : stats.slice(0, 3);
        if (!display.length) return null;
        return (
          <div className="relative mt-7 grid gap-4 sm:grid-cols-3">
            {display.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">{metric.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-[#0F172A]">{metric.value}</span>
                  <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-[10px] font-semibold text-[#2563EB]">
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </section>
  );
}