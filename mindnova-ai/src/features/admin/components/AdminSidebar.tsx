"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
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
  { label: "Quản lý khóa học", href: "/admin/content", icon: BookOpen },
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
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400",
    title: "Tất cả dịch vụ đang ổn định",
    subtitle: "Dữ liệu theo thời gian thực đã được đồng bộ.",
  },
  {
    tag: "LATENCY",
    badge: "12ms",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-400 animate-pulse",
    title: "Kết nối DB & R2 siêu tốc",
    subtitle: "Thời gian phản hồi API trung bình < 45ms.",
  },
  {
    tag: "SECURITY",
    badge: "ACTIVE",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]",
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
    <aside className="flex h-full w-[260px] xl:w-[280px] shrink-0 flex-col overflow-hidden border-r border-[#E2E8F0] bg-white text-[#0F172A]">
      <div className="shrink-0 border-b border-[#E2E8F0] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-md">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#3B82F6]">
              MindNova
            </p>
            <h2 className="mt-0.5 text-xl font-semibold text-[#0F172A] [font-family:var(--font-admin-head)]">
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
                  ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30"
                  : "text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : "text-[#64748B] group-hover:text-[#2563EB]"}`}
                strokeWidth={1.8}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-[#E2E8F0] px-2.5 py-3">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="group/slide relative cursor-default rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-[#64748B]">
            <span>{slide.tag}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold ${slide.badgeColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${slide.dotColor}`} />
              {slide.badge}
            </span>
          </div>

          <div key={currentSlide} className="mt-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <p className="truncate text-xs font-bold leading-snug text-[#0F172A] sm:text-[13px]">{slide.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-[#64748B]">{slide.subtitle}</p>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-[#E2E8F0] pt-2">
            <div className="flex items-center gap-1.5">
              {systemSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-5 bg-[#3B82F6]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover/slide:opacity-100">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + systemSlides.length) % systemSlides.length)}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[#64748B] hover:bg-[#E2E8F0]"
                title="Slide trước"
                type="button"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % systemSlides.length)}
                className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[#64748B] hover:bg-[#E2E8F0]"
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
