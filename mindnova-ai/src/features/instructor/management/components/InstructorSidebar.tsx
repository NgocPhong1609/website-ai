"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import {
 CourseManagementNavIcon,
 StudentManagementNavIcon,
 AITeachingNavIcon,
 RevenueNavIcon,
 SettingsNavIcon,
 HelpNavIcon,
 DiscussionsNavIcon,
 QuizNavIcon,
} from "./icons";

import { Plus, Sparkles } from "lucide-react";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";

function LogoMark() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-md">
      <Sparkles className="h-[18px] w-[18px]" aria-hidden />
    </div>
  );
}

function CreateCourseCTA() {
 return (
 <div className="px-1 py-1 shrink-0">
 <Link
 href="/instructor/create-course"
 title="Create New Course"
 className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-xs font-black text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-md transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 <span className="truncate tracking-wide uppercase font-black">TẠO KHÓA HỌC MỚI</span>
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
 className="w-9 h-9 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center text-sm font-black shadow-2xs shrink-0 border border-[#3B82F6]/20 overflow-hidden hover:ring-2 hover:ring-[#3B82F6]/50 transition-all focus:outline-none"
 >
 {avatarUrl ? (
 <img src={avatarUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = initial; }} />
 ) : (
 initial
 )}
 </button>

 {isDropdownOpen && (
 <div className={twMerge(
 "absolute z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[160px] overflow-hidden",
 isCollapsed ? "left-full ml-2 bottom-0" : "bottom-full mb-2 left-2"
 )}>
 <Link
 href="/instructor/profile"
 onClick={() => setIsDropdownOpen(false)}
 className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
 >
 Thông tin tài khoản
 </Link>
 <button
 onClick={handleLogout}
 className="w-full text-left px-4 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
 >
 Đăng xuất
 </button>
 </div>
 )}

 {!isCollapsed && (
 <Link href="/instructor/profile" className="flex items-center gap-1 min-w-0 leading-tight group cursor-pointer">
 <span className="text-sm font-black text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">{name}</span>
 {user?.is_verified && <VerifiedTeacherBadge isVerified={true} size="xs" />}
 </Link>
 )}
 </div>
 );
}

interface NavItem {
 label: string;
 href: string;
 activePatterns?: string[];
 Icon: React.FC;
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
 "group relative flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
 isCollapsed ? "justify-center px-0" : "px-3",
 isActive
 ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30"
 : "text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]",
 )}
 >
 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
 isActive
 ? "text-white"
 : "text-[#64748B] group-hover:text-[#2563EB] group-hover:bg-[#F8FAFC]",
 )}
 >
 <Icon />
 </span>
 {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
 </Link>
 </li>
 );
}

export function InstructorSidebar() {
 const [isCollapsed, setIsCollapsed] = React.useState(false);

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
 { label: "Quản lý Khóa học", href: "/instructor/courses", Icon: CourseManagementNavIcon },
 { 
 label: "Tạo bài Kiểm tra", 
 href: "/instructor/quiz-generator", 
 activePatterns: ["/instructor/quiz-generator"], 
 Icon: QuizNavIcon 
 },
 { 
 label: "Thảo luận & Hỏi đáp", 
 href: "/instructor/discussions", 
 activePatterns: ["/instructor/discussions", "/instructor/messages", "/instructor/chat", "/chat"],
 Icon: DiscussionsNavIcon 
 },
 { label: "Quản lý Học viên", href: "/instructor/students", activePatterns: ["/instructor/analytics"], Icon: StudentManagementNavIcon },
 { label: "Quản lý Doanh thu", href: "/instructor/revenue", Icon: RevenueNavIcon },
 ];

 return (
 <aside className={twMerge("shrink-0 h-full flex flex-col bg-white border-r border-[#E2E8F0] shadow-sm z-50 transition-all duration-300", isCollapsed ? "w-[80px]" : "w-[234px]")}>
 {/* Brand */}
 <div className={twMerge("h-16 shrink-0 border-b border-[#E2E8F0] flex items-center justify-center", isCollapsed ? "px-2" : "px-4")}>
 <Link href="/instructor/courses" className="flex items-center gap-3 group" aria-label="MindNova AI — Instructor">
 <LogoMark />
 {!isCollapsed && (
 <div className="flex flex-col leading-tight">
 <span className="text-sm font-black text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-colors duration-150">
 Instructor Portal
 </span>
 <span className="text-[10px] text-[#64748B] font-extrabold tracking-wide uppercase">
 Professional Suite
 </span>
 </div>
 )}
 </Link>
 </div>

 {/* Main nav */}
 <nav className={twMerge("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")} aria-label="Instructor navigation">
 {!isCollapsed && (
 <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-3">
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
 className="flex items-center justify-center w-full h-10 rounded-xl text-xs font-black text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-md transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 </Link>
 ) : (
 <CreateCourseCTA />
 )}
 </div>

 <div className={twMerge("py-3 border-t border-gray-100 flex flex-col gap-3", isCollapsed ? "px-2" : "px-3")}>
 <SidebarUserProfile isCollapsed={isCollapsed} />
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className={twMerge("flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] group", isCollapsed ? "justify-center" : "justify-between w-full")}
 >
 {isCollapsed ? (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#0F172A] transition-colors">
 <line x1="4" x2="20" y1="12" y2="12" />
 <line x1="4" x2="20" y1="6" y2="6" />
 <line x1="4" x2="20" y1="18" y2="18" />
 </svg>
 ) : (
 <>
 <div className="flex items-center gap-2.5">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#0F172A] transition-colors">
 <line x1="4" x2="20" y1="12" y2="12" />
 <line x1="4" x2="20" y1="6" y2="6" />
 <line x1="4" x2="20" y1="18" y2="18" />
 </svg>
 <span>Thu gọn</span>
 </div>
 <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-[#E2E8F0] text-[10px] font-black tracking-widest text-gray-400 group-hover:text-[#64748B] group-hover:border-gray-300 transition-colors">Ctrl+B</span>
 </>
 )}
 </button>
 </div>
 </aside>
 );
}
