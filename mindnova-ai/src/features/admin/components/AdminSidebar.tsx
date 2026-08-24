"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Tổng quan", href: "/admin", icon: "⌂" },
  { label: "Người dùng", href: "/admin/users", icon: "◌" },
  { label: "Duyệt giáo viên", href: "/admin/teacher-approvals", icon: "✦" },
  { label: "AI & System", href: "/admin/ai-system", icon: "◫" },
  { label: "Nội dung", href: "/admin/content", icon: "◈" },
  { label: "Mã giảm giá", href: "/admin/coupons", icon: "◌" },
  { label: "Doanh thu", href: "/admin/revenue", icon: "◍" },
  { label: "Báo cáo", href: "/admin/analytics", icon: "▣" },
  { label: "Kiểm duyệt", href: "/admin/moderation-support", icon: "⚑" },
];

const systemSlides = [
  {
    tag: "SYSTEM",
    badge: "LIVE",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    title: "Tất cả dịch vụ đang ổn định",
    subtitle: "Dữ liệu theo thời gian thực đã được đồng bộ.",
  },
  {
    tag: "LATENCY",
    badge: "12ms",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    dotColor: "bg-cyan-400 animate-pulse",
    title: "Kết nối DB & R2 siêu tốc",
    subtitle: "Thời gian phản hồi API trung bình < 45ms.",
  },
  {
    tag: "SECURITY",
    badge: "ACTIVE",
    badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    dotColor: "bg-indigo-400",
    title: "Bảo mật SSL & Signed URL",
    subtitle: "Mã hóa tài liệu minh chứng 2 lớp an toàn.",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % systemSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = systemSlides[currentSlide];

  return (
    <aside className="flex h-full w-[260px] xl:w-[280px] shrink-0 flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,#0f172a_0%,#101f36_38%,#16284b_100%)] text-slate-100 overflow-hidden">
      {/* Brand Header */}
      <div className="px-4 py-4 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500 text-xs font-black tracking-[0.18em] text-slate-900 shadow-[0_18px_35px_-18px_rgba(59,130,246,0.9)]">
            MN
          </div>
          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-200/70">
              MindNova
            </p>
            <h2 className="mt-0.5 text-xl font-semibold text-white [font-family:var(--font-admin-head)]">
              Admin
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation List - Compact & Scrollable */}
      <nav className="flex-1 overflow-y-auto min-h-0 px-2.5 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(14,165,233,0.28),rgba(96,165,250,0.16))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_24px_-16px_rgba(56,189,248,0.8)] ring-1 ring-white/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_6px_14px_-8px_rgba(56,189,248,0.9)]"
                    : "bg-slate-700/70 text-slate-200 group-hover:bg-slate-600/80"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Interactive System Status Slide Carousel */}
      <div className="border-t border-white/10 px-2.5 py-3 shrink-0">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(59,130,246,0.08),rgba(15,23,42,0.35))] p-3 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group/slide cursor-default transition-all"
        >
          {/* Header Tag & Live Badge */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/75">
            <span>{slide.tag}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${slide.badgeColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${slide.dotColor}`} />
              {slide.badge}
            </span>
          </div>

          {/* Dynamic Animated Content */}
          <div key={currentSlide} className="mt-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <p className="text-xs sm:text-[13px] font-bold text-white leading-snug truncate">
              {slide.title}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-slate-300/90 line-clamp-2">
              {slide.subtitle}
            </p>
          </div>

          {/* Carousel Slide Indicators (Dots & Arrows) */}
          <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2">
            <div className="flex items-center gap-1.5">
              {systemSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-5 bg-cyan-400" : "w-1.5 bg-slate-600 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + systemSlides.length) % systemSlides.length)}
                className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-white"
                title="Slide trước"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % systemSlides.length)}
                className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-white"
                title="Slide tiếp"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
