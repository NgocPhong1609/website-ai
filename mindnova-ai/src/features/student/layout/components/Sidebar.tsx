"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { HelpCircle, LogOut, Menu } from "lucide-react";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";

function HelpIcon() {
  return <HelpCircle width={15} height={15} strokeWidth={1.8} aria-hidden />;
}

function LogoutIcon() {
  return <LogOut width={15} height={15} strokeWidth={1.8} aria-hidden />;
}

function MenuIcon() {
  return <Menu width={18} height={18} strokeWidth={2.5} aria-hidden />;
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

import { usePathname, useSearchParams } from "next/navigation";
import { axiosClient } from "@/src/shared/lib/axios";
import { MOBILE_SIDEBAR_EVENT } from "./mobileSidebar";
import { InstructorSidebar } from "@/src/features/instructor/management/components/InstructorSidebar";
import { resolveUserRole } from "@/src/features/student/auth/components/login/AuthShared";

export default function Sidebar() {
  const searchParams = useSearchParams();
  const isPreview = searchParams ? searchParams.get("preview") === "true" : false;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
 const [isMobileOpen, setIsMobileOpen] = useState(false);
 const pathname = usePathname();

 // Mobile drawer: opened from the topbar hamburger, closed on navigation.
 useEffect(() => {
 const toggle = () => setIsMobileOpen((open) => !open);
 window.addEventListener(MOBILE_SIDEBAR_EVENT, toggle);
 return () => window.removeEventListener(MOBILE_SIDEBAR_EVENT, toggle);
 }, []);
 useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(!!window.localStorage.getItem("accessToken"));
    try {
      const userInfoRaw = window.localStorage.getItem("userInfo");
      if (userInfoRaw) {
        const u = JSON.parse(userInfoRaw);
        const role = resolveUserRole(u);
        if (role === "instructor" || (role as string) === "teacher") {
          setIsTeacher(true);
        }
      }
    } catch (e) {}
  }, []);

  if (isPreview || isTeacher) {
    return <InstructorSidebar />;
  }
 
 // Revoke the Sanctum token on the server before clearing local credentials.
 const handleLogout = async () => {
 try {
 await axiosClient.post("/api/logout");
 } catch {
 // Token may already be invalid; local cleanup below still logs the user out.
 }
 window.localStorage.clear();
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 window.location.assign("/login");
 };

 return (
 <>
 {isMobileOpen && (
 <div className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" aria-hidden onClick={() => setIsMobileOpen(false)} />
 )}
 <aside className={twMerge(
 "shrink-0 h-screen flex flex-col bg-white border-r border-slate-200 transition-all duration-300 group/sidebar",
 // Off-canvas drawer below md, static column from md up.
 "fixed inset-y-0 left-0 z-50 w-64 md:static md:z-auto",
 isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0",
 isCollapsed ? "md:w-[72px]" : "md:w-56"
 )}>
 {/* Brand & Toggle */}
 <div className={twMerge(
 "py-[18px] border-b border-slate-200 flex items-center transition-all",
 isCollapsed ? "px-2 flex-col justify-center gap-4" : "px-4 justify-between"
 )}>
 <SidebarBrand isCollapsed={isCollapsed} />
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shrink-0"
 aria-label={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
 >
 <MenuIcon />
 </button>
 </div>

 {/* Navigation */}
 <SidebarNav isCollapsed={isCollapsed} />

 {/* Bottom section */}
 <div className={twMerge("py-5 border-t border-slate-200 flex flex-col gap-3", isCollapsed ? "px-2 items-center" : "px-4")}>
 
 

 {/* Help + Auth */}
 <div className="flex flex-col gap-0.5 w-full">

 
 {isMounted && isLoggedIn ? (
 <button
 type="button"
 onClick={handleLogout}
 title={isCollapsed ? "Đăng xuất" : undefined}
 className={twMerge(
 "flex items-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 shrink-0 cursor-pointer",
 isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
 )}
 >
 <LogoutIcon />
 {!isCollapsed && <span>Đăng xuất</span>}
 </button>
 ) : isMounted && !isLoggedIn ? (
 <Link
 href="/login"
 title={isCollapsed ? "Đăng nhập" : undefined}
 className={twMerge(
 "flex items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 shrink-0 text-decoration-none",
 isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
 )}
 >
 <LogoutIcon />
 {!isCollapsed && <span>Đăng nhập</span>}
 </Link>
 ) : null}
 </div>
 </div>
 </aside>
 </>
 );
}