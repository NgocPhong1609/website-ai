"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAdminNavigation } from "./AdminDashboardShell";

const navItems = [
 { label: "Tổng quan", href: "/admin", icon: "⌂" },
 { label: "Người dùng", href: "/admin/users", icon: "◌" },
 { label: "Duyệt giáo viên", href: "/admin/teacher-approvals", icon: "❖" },
 { label: "AI & System", href: "/admin/ai-system", icon: "◫" },
 { label: "Nội dung", href: "/admin/content", icon: "◈" },
 { label: "Mã giảm giá", href: "/admin/coupons", icon: "◌" },
 { label: "Doanh thu", href: "/admin/revenue", icon: "◍" },
 { label: "Báo cáo", href: "/admin/analytics", icon: "▣" },
 { label: "Kiểm duyệt", href: "/admin/moderation-support", icon: "⬟" },
];

export function AdminSidebar() {
 const pathname = usePathname();
 const { closeNavigation, isOpen } = useAdminNavigation();
 const [isDesktop, setIsDesktop] = useState(false);
 const sidebarRef = useRef<HTMLElement>(null);
 const closeButtonRef = useRef<HTMLButtonElement>(null);

 useEffect(() => {
 const desktopMedia = window.matchMedia("(min-width: 1024px)");
 const updateDesktopState = () => setIsDesktop(desktopMedia.matches);

 updateDesktopState();
 desktopMedia.addEventListener("change", updateDesktopState);
 return () => desktopMedia.removeEventListener("change", updateDesktopState);
 }, []);

 useEffect(() => {
 if (isOpen && !isDesktop) {
 closeButtonRef.current?.focus();
 }
 }, [isDesktop, isOpen]);

 useEffect(() => {
 if (!isOpen || isDesktop) return;

 const containFocus = (event: KeyboardEvent) => {
 if (event.key !== "Tab" || !sidebarRef.current) return;

 const focusableElements = Array.from(
 sidebarRef.current.querySelectorAll<HTMLElement>(
 "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
 ),
 );
 const firstElement = focusableElements[0];
 const lastElement = focusableElements.at(-1);

 if (!firstElement || !lastElement) return;

 const activeElement = document.activeElement;
 const focusIsOutside = !sidebarRef.current.contains(activeElement);

 if (event.shiftKey && (activeElement === firstElement || focusIsOutside)) {
 event.preventDefault();
 lastElement.focus();
 return;
 }

 if (!event.shiftKey && (activeElement === lastElement || focusIsOutside)) {
 event.preventDefault();
 firstElement.focus();
 }
 };

 document.addEventListener("keydown", containFocus);
 return () => document.removeEventListener("keydown", containFocus);
 }, [isDesktop, isOpen]);

 return (
 <>
 {isOpen && (
 <button
 type="button"
 aria-label="Đóng menu quản trị bằng lớp phủ"
 className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-xs lg:hidden"
 onClick={closeNavigation}
 />
 )}

 <aside
 ref={sidebarRef}
 id="admin-sidebar"
 aria-label="Điều hướng quản trị"
 aria-hidden={!isDesktop && !isOpen ? true : undefined}
 inert={!isDesktop && !isOpen}
 className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[260px] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-[linear-gradient(180deg,#0f172a_0%,#101f36_38%,#16284b_100%)] text-slate-100 shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-full lg:translate-x-0 lg:shadow-none xl:w-[280px] ${
 isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full lg:pointer-events-auto"
 }`}
 >
 {/* Brand Header */}
 <div className="px-4 py-4 shrink-0 border-b border-white/5">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-2xl -[#C0392B] via-sky-400 -[#C0392B] text-xs font-black tracking-[0.18em] text-slate-900 shadow-[0_18px_35px_-18px_rgba(59,130,246,0.9)]">
 MN
 </div>
 <div className="leading-none">
 <p className="text-[10px] font-medium uppercase tracking-[0.28em] -[#FAF7F2]/70">
 MindNova
 </p>
 <h2 className="mt-0.5 text-xl font-semibold text-white [font-family:var(--font-admin-head)]">
 Admin
 </h2>
 </div>
 {isOpen && (
 <button
 ref={closeButtonRef}
 type="button"
 aria-label="Đóng menu quản trị"
 onClick={closeNavigation}
 className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xl text-white transition hover:bg-white/20 lg:hidden"
 >
 ×
 </button>
 )}
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
 onClick={closeNavigation}
 className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
 isActive
 ? "bg-[linear-gradient(135deg,rgba(14,165,233,0.28),rgba(96,165,250,0.16))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_24px_-16px_rgba(56,189,248,0.8)] ring-1 ring-white/10"
 : "text-slate-300 hover:bg-white/5 hover:text-white"
 }`}
 >
 <span
 className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
 isActive
 ? " -[#C0392B] -[#C0392B] text-slate-950 shadow-[0_6px_14px_-8px_rgba(56,189,248,0.9)]"
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

 <div className="hidden shrink-0 border-t border-white/10 px-2.5 py-3 lg:block">
 <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
 <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
 Trợ giúp quản trị
 </p>
 <p className="mt-2 text-xs font-semibold leading-snug text-white">
 Chọn một mục để quản lý dữ liệu và cấu hình.
 </p>
 </div>
 </div>
 </aside>
 </>
 );
}
