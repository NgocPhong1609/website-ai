"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import { MOBILE_SIDEBAR_EVENT } from "@/src/features/student/layout/components/mobileSidebar";

import { Menu, Plus, BookOpen, DollarSign, FileQuestion, MessageSquare, Users, UserRound, type LucideIcon } from "lucide-react";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";

function LogoMark() {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-blue-100/60 bg-[#0F265C]">
      <Image
        src="/images/logo.png"
        alt="MindNova AI"
        width={36}
        height={36}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}

function CreateCourseCTA() {
 return (
 <div className="px-1 py-1 shrink-0">
 <Link
 href="/instructor/create-course"
 title="Create New Course"
 className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 <span className="truncate tracking-wide uppercase font-bold">TẠO KHÓA HỌC MỚI</span>
 </Link>
 </div>
 );
}

function SidebarUserProfile({ isCollapsed }: { isCollapsed: boolean }) {
 const [user, setUser] = React.useState<any>(null);
 const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
 const dropdownRef = React.useRef<HTMLDivElement>(null);

 const loadUser = React.useCallback(() => {
 try {
 const userInfoRaw = window.localStorage.getItem("userInfo");
 if (userInfoRaw) {
 setUser(JSON.parse(userInfoRaw));
 }
 } catch (e) {
 console.error("Error parsing user info", e);
 }
 }, []);

 React.useEffect(() => {
 loadUser();
 window.addEventListener("user:updated", loadUser);
 window.addEventListener("storage", loadUser);
 return () => {
 window.removeEventListener("user:updated", loadUser);
 window.removeEventListener("storage", loadUser);
 };
 }, [loadUser]);

 React.useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsDropdownOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleLogout = async () => {
 try {
 await axiosClient.post("/api/logout");
 } catch (error) {
 console.error("Logout API failed", error);
 } finally {
 window.localStorage.removeItem("accessToken");
 window.localStorage.removeItem("userInfo");
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 window.location.replace("/login");
 }
 };

 const getInitial = (name: string) => {
 if (!name) return "U";
 return name.charAt(0).toUpperCase();
 };

 const name = user?.name || "Teacher";
 const avatarUrl = user?.avatar_url || user?.avatar || user?.profile_image || null;
 const initial = getInitial(name);

 return (
 <div className={twMerge("relative flex py-2", isCollapsed ? "flex-col gap-3 items-center" : "items-center gap-3 px-2")} ref={dropdownRef}>
 <button 
 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
 className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm shrink-0 border border-blue-100 overflow-hidden hover:ring-2 hover:ring-blue-200 transition-all focus:outline-none"
 >
 {avatarUrl ? (
 <img src={avatarUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = initial; }} />
 ) : (
 initial
 )}
 </button>

 {isDropdownOpen && (
 <div className={twMerge(
 "absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[160px] overflow-hidden",
 isCollapsed ? "left-full ml-2 bottom-0" : "bottom-full mb-2 left-2"
 )}>
 <Link
 href="/instructor/profile"
 onClick={() => setIsDropdownOpen(false)}
 className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
 >
 Thông tin tài khoản
 </Link>
 <button
 onClick={handleLogout}
 className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
 >
 Đăng xuất
 </button>
 </div>
 )}

 {!isCollapsed && (
 <Link href="/instructor/profile" className="flex items-center gap-1 min-w-0 leading-tight group cursor-pointer">
 <span className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{name}</span>
 {Boolean(user?.is_verified) && <VerifiedTeacherBadge isVerified={true} size="xs" />}
 </Link>
 )}
 </div>
 );
}

interface NavItem {
 label: string;
 href: string;
 activePatterns?: string[];
 Icon: LucideIcon;
 isCollapsed?: boolean;
}

function SidebarNavItem({ label, href, activePatterns, Icon, isCollapsed }: NavItem) {
 const pathname = usePathname();
 // Mark as active if it's the exact path, a sub-path, or matches any activePatterns
 const isActive = pathname === href || pathname.startsWith(href + "/") || (activePatterns && activePatterns.some(pattern => pathname.startsWith(pattern)));

 return (
 <li>
 <Link
 href={href}
 aria-current={isActive ? "page" : undefined}
 title={isCollapsed ? label : undefined}
 className={twMerge(
 "group relative flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
 isCollapsed ? "justify-center px-0" : "px-3",
 isActive
 ? "bg-blue-50 text-blue-600"
 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
 )}
 >
 <span
 className={twMerge(
 "absolute left-0 w-[3px] h-5 rounded-r-full bg-blue-600 transition-all duration-200",
 isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
 )}
 />
 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 shrink-0",
 isActive
 ? "bg-blue-100/50 text-blue-600"
 : "text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50",
 )}
 >
 <Icon size={18} aria-hidden />
 </span>
 {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
 </Link>
 </li>
 );
}

export function InstructorSidebar() {
 const pathname = usePathname();
 const [isCollapsed, setIsCollapsed] = React.useState(false);
 const [isMobileOpen, setIsMobileOpen] = React.useState(false);

 React.useEffect(() => {
   const toggle = () => setIsMobileOpen((open) => !open);
   window.addEventListener(MOBILE_SIDEBAR_EVENT, toggle);
   return () => window.removeEventListener(MOBILE_SIDEBAR_EVENT, toggle);
 }, []);
 
 React.useEffect(() => { setIsMobileOpen(false); }, [pathname]);

 React.useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
 e.preventDefault();
 setIsCollapsed((prev) => !prev);
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const INSTRUCTOR_NAV: NavItem[] = [
  { label: "Quản lý Khóa học", href: "/instructor/courses", Icon: BookOpen },
  { 
    label: "Tạo bài Kiểm tra", 
    href: "/instructor/quiz-generator", 
    activePatterns: ["/instructor/quiz-generator"], 
    Icon: FileQuestion 
  },
  { 
    label: "Thảo luận & Hỏi đáp", 
    href: "/instructor/discussions", 
    activePatterns: ["/instructor/discussions"],
    Icon: MessageSquare 
  },
  { 
    label: "Tin nhắn", 
    href: "/instructor/messages", 
    activePatterns: ["/instructor/messages", "/instructor/chat", "/chat"],
    Icon: MessageSquare 
  },
  { label: "Quản lý Học viên", href: "/instructor/students", activePatterns: ["/instructor/analytics"], Icon: Users },
  { label: "Quản lý Doanh thu", href: "/instructor/revenue", Icon: DollarSign },
  { label: "Hồ sơ & xác minh", href: "/instructor/profile", Icon: UserRound },
 ];

 return (
  <>
  {isMobileOpen && (
    <div className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" aria-hidden onClick={() => setIsMobileOpen(false)} />
  )}
  <aside className={twMerge(
    "shrink-0 h-full flex flex-col bg-white border-r border-slate-200 z-50 transition-all duration-300", 
    "fixed inset-y-0 left-0 md:static md:z-auto",
    isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0",
    isCollapsed ? "md:w-[80px] w-[234px]" : "w-[234px]"
  )}>
 {/* Brand */}
 <div className={twMerge("h-16 shrink-0 border-b border-slate-200 flex items-center justify-center", isCollapsed ? "px-2" : "px-4")}>
 <Link href="/instructor/courses" className="flex items-center gap-3 group" aria-label="MindNova AI — Instructor">
 <LogoMark />
 {!isCollapsed && (
 <div className="flex flex-col leading-tight">
 <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-150">
 Instructor Portal
 </span>
 <span className="text-xs text-slate-400 font-medium tracking-wide">
 Professional Suite
 </span>
 </div>
 )}
 </Link>
 </div>

 {/* Main nav */}
 <nav className={twMerge("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")} aria-label="Instructor navigation">
 {!isCollapsed && (
 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
 QUẢN LÝ & GIẢNG DẠY
 </div>
 )}
 <ul className="flex flex-col gap-1">
 {INSTRUCTOR_NAV.map((item) => (
 <SidebarNavItem key={item.href} {...item} isCollapsed={isCollapsed} />
 ))}
 </ul>
 </nav>

 <div className={twMerge("pb-4", isCollapsed ? "px-2" : "px-4")}>
 {isCollapsed ? (
 <Link
 href="/instructor/create-course"
 title="Create New Course"
 className="flex items-center justify-center w-full h-10 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 </Link>
 ) : (
 <CreateCourseCTA />
 )}
 </div>

 <div className={twMerge("py-3 border-t border-slate-200 flex flex-col gap-3", isCollapsed ? "px-2" : "px-3")}>
 <SidebarUserProfile isCollapsed={isCollapsed} />
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className={twMerge("flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg hover:bg-slate-50 group", isCollapsed ? "justify-center" : "justify-between w-full")}
 >
 {isCollapsed ? (
 <Menu className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={2.5} aria-hidden />
 ) : (
 <>
 <div className="flex items-center gap-2.5">
 <Menu className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={2.5} aria-hidden />
 <span>Thu gọn</span>
 </div>
 <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold tracking-wide text-slate-400 group-hover:text-slate-500 group-hover:border-slate-300 transition-colors">Ctrl+B</span>
 </>
 )}
 </button>
  </div>
  </aside>
  </>
 );
}
