"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Cpu,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  DollarSign,
  TicketPercent,
  Users,
  Tags,
  type LucideProps,
} from "lucide-react";

const navItems: Array<{
  label: string;
  href: string;
  icon: ComponentType<LucideProps>;
}> = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Người dùng", href: "/admin/users", icon: Users },
  { label: "Duyệt giáo viên", href: "/admin/teacher-approvals", icon: GraduationCap },
  { label: "AI & System", href: "/admin/ai-system", icon: Cpu },
  { label: "Nội dung", href: "/admin/content", icon: BookOpen },
  { label: "Quản lý danh mục", href: "/admin/categories", icon: Tags },
  { label: "Mã giảm giá", href: "/admin/coupons", icon: TicketPercent },
  { label: "Doanh thu", href: "/admin/revenue", icon: DollarSign },
  { label: "Báo cáo", href: "/admin/analytics", icon: BarChart3 },
  { label: "Kiểm duyệt", href: "/admin/moderation-support", icon: ShieldAlert },
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
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    dotColor: "bg-blue-400 animate-pulse",
    title: "Kết nối DB & R2 siêu tốc",
    subtitle: "Thời gian phản hồi API trung bình < 45ms.",
  },
  {
    tag: "SECURITY",
    badge: "ACTIVE",
    badgeColor: "bg-blue-600/15 text-blue-200 border-blue-600/30",
    dotColor: "bg-blue-400",
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
    <aside className="flex h-full w-[260px] xl:w-[280px] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-[linear-gradient(180deg,#0f172a_0%,#101f36_38%,#16284b_100%)] text-slate-100">
      <div className="shrink-0 border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#60A5FA] to-[#2563EB] text-white shadow-[0_18px_35px_-18px_rgba(59,130,246,0.9)]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-blue-200/70">
              MindNova
            </p>
            <h2 className="mt-0.5 text-xl font-semibold text-white [font-family:var(--font-admin-head)]">
              Admin
            </h2>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2.5 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.28),rgba(96,165,250,0.16))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_24px_-16px_rgba(37,99,235,0.8)] ring-1 ring-white/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-blue-200" : "text-slate-400 group-hover:text-blue-200"}`}
                strokeWidth={1.8}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-2.5 py-3">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="group/slide relative cursor-default rounded-2xl bg-[linear-gradient(135deg,rgba(96,165,250,0.14),rgba(59,130,246,0.08),rgba(15,23,42,0.35))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10 transition-all"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100/75">
            <span>{slide.tag}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${slide.badgeColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${slide.dotColor}`} />
              {slide.badge}
            </span>
          </div>

          <div key={currentSlide} className="mt-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <p className="truncate text-xs font-bold leading-snug text-white sm:text-[13px]">{slide.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-slate-300/90">{slide.subtitle}</p>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2">
            <div className="flex items-center gap-1.5">
              {systemSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-5 bg-[#3B82F6]" : "w-1.5 bg-slate-600 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover/slide:opacity-100">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + systemSlides.length) % systemSlides.length)}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
                title="Slide trước"
                type="button"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % systemSlides.length)}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
                title="Slide tiếp"
                type="button"
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
