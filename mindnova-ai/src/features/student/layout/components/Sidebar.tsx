"use client";

import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Hàm xử lý Logout chuyên nghiệp
  const handleLogout = () => {
    // 1. Xóa sạch dữ liệu lưu trong trình duyệt
    window.localStorage.clear();
    
    // 2. Xóa các Cookie bằng cách đặt thời gian hết hạn về quá khứ
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // 3. Chuyển hướng về trang Login
    window.location.assign("/login");
  };

  return (
    <aside className={twMerge(
      "shrink-0 h-screen flex flex-col bg-white border-r border-[#F0F0F8] transition-all duration-300 relative group/sidebar",
      isCollapsed ? "w-[72px]" : "w-60"
    )}>
      {/* Brand & Toggle */}
      <div className={twMerge(
        "py-[18px] border-b border-[#F4F4FA] flex items-center transition-all",
        isCollapsed ? "px-2 flex-col justify-center gap-4" : "px-4 justify-between"
      )}>
        <SidebarBrand isCollapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#5052EE] transition-all cursor-pointer shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Navigation */}
      <SidebarNav isCollapsed={isCollapsed} />

      {/* Bottom section */}
      <div className="px-4 py-5 border-t border-[#F4F4FA] flex flex-col gap-3">
        
        {/* Nút Test Onboarding (Tạo tạm để kiểm tra luồng) */}
        <Link
          href="/onboarding"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-[#6B6BFF] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all duration-200"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
          Test Onboarding
        </Link>

        {/* Upgrade to Pro */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_16px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_24px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
        >
          <SparkleIcon />
          Upgrade to Pro
        </button>

        {/* Help + Logout */}
        <div className="flex flex-col gap-0.5">
          <Link
            href="/help"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150"
          >
            <HelpIcon />
            <span>Help</span>
          </Link>
          
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={twMerge(
              "flex items-center rounded-lg text-[#64647A] hover:bg-red-50 hover:text-red-500 transition-all duration-150 shrink-0 cursor-pointer",
              isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
            )}
          >
            <LogoutIcon />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}