"use client";

import type { AdminOverviewData } from "@/src/features/admin/types";
import { useRouter } from "next/navigation";

interface AdminHeroBannerProps {
 hero: AdminOverviewData["hero"];
}

export function AdminHeroBanner({ hero }: AdminHeroBannerProps) {
 const router = useRouter();

 const handleSecondaryAction = () => {
 router.push("/admin/analytics");
 };

 const handlePrimaryAction = () => {
 router.push("/admin/content");
 };

 return (
 <section className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(120deg,#08162d_0%,#122a49_35%,#1b3f6b_70%,#244f84_100%)] py-4 px-5 lg:py-5 lg:px-6 text-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.8)]">
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.26),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.28),transparent_30%)]" />
 <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
 <div className="max-w-2xl">
 <p className="text-[11px] uppercase tracking-[0.28em] -[#FAF7F2]/85">
 Bảng điều khiển quản trị
 </p>
 <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl [font-family:var(--font-admin-head)]">
 {hero.title}
 </h1>
 <p className="mt-3 max-w-xl text-sm text-slate-200/90">{hero.description}</p>
 </div>

 <div className="flex flex-wrap gap-3">
 <button
 type="button"
 onClick={handleSecondaryAction}
 className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
 >
 {hero.secondaryAction}
 </button>
 <button
 type="button"
 onClick={handlePrimaryAction}
 className="rounded-full -[#C0392B] px-4 py-2 text-sm font-semibold text-[#0a1d3d] shadow-[0_10px_24px_-12px_rgba(34,211,238,0.85)] transition hover:-[#FAF7F2]"
 >
 {hero.primaryAction}
 </button>
 </div>
 </div>

 <div className="relative mt-7 grid gap-4 sm:grid-cols-3">
 {[
 { label: "Tổng doanh thu", value: "$128.4K", trend: "+18.2%" },
 { label: "Khóa học mới", value: "246", trend: "+9.6%" },
 { label: "Tỷ lệ hoàn thành", value: "84.7%", trend: "+2.8%" },
 ].map((metric) => (
 <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
 <p className="text-[11px] uppercase tracking-[0.2em] -[#FAF7F2]/60">{metric.label}</p>
 <div className="mt-3 flex items-end justify-between gap-3">
 <span className="text-2xl font-semibold text-white">{metric.value}</span>
 <span className="rounded-full -[#2C3039]/15 px-2 py-1 text-[10px] font-semibold -[#FAF7F2]">
 {metric.trend}
 </span>
 </div>
 </div>
 ))}
 </div>
 </section>
 );
}
