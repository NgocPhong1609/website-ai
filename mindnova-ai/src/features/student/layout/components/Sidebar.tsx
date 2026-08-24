"use client";

import { useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(!!window.localStorage.getItem("accessToken"));
  }, []);
  
  // Hàm xử lý Logout chuyên nghiệp
  const handleLogout = () => {
    window.localStorage.clear();
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
      <div className={twMerge("py-5 border-t border-[#F4F4FA] flex flex-col gap-3", isCollapsed ? "px-2 items-center" : "px-4")}>
        
        {/* Nút Test Onboarding */}
        <Link
          href="/onboarding"
          title={isCollapsed ? "Test Onboarding" : undefined}
          className={twMerge(
            "flex items-center justify-center transition-all duration-200 text-[#6B6BFF] bg-blue-50 border border-blue-200 hover:bg-blue-100",
            isCollapsed 
              ? "w-10 h-10 rounded-xl" 
              : "w-full gap-2 py-3 px-4 rounded-xl text-sm font-semibold"
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
          {!isCollapsed && <span>Test Onboarding</span>}
        </Link>

        {/* Upgrade to Pro */}
        <button
          type="button"
          title={isCollapsed ? "Upgrade to Pro" : undefined}
          className={twMerge(
            "flex items-center justify-center transition-all duration-200 text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40",
            isCollapsed
              ? "w-10 h-10 rounded-xl shadow-[0_4px_16px_rgba(107,107,255,0.4)]"
              : "w-full gap-2 py-3 px-4 rounded-xl text-sm font-semibold shadow-[0_4px_16px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_24px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <SparkleIcon />
          {!isCollapsed && <span>Upgrade to Pro</span>}
        </button>

        {/* Help + Auth */}
        <div className="flex flex-col gap-0.5 w-full">
          <Link
            href="/help"
            title={isCollapsed ? "Help" : undefined}
            className={twMerge(
              "flex items-center rounded-lg text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150 shrink-0",
              isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
            )}
          >
            <HelpIcon />
            {!isCollapsed && <span>Help</span>}
          </Link>
          
          {isMounted && isLoggedIn ? (
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
          ) : isMounted && !isLoggedIn ? (
            <Link
              href="/login"
              title={isCollapsed ? "Login" : undefined}
              className={twMerge(
                "flex items-center rounded-lg text-[#64647A] hover:bg-[#EEF2FF] hover:text-[#5052EE] transition-all duration-150 shrink-0 text-decoration-none",
                isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
              )}
            >
              <LogoutIcon /> {/* Same icon rotated or just use the same for Login layout consistency, maybe a different icon but LogoutIcon is okay for now or we can use another icon. I'll just use LogoutIcon for Login since we don't have a LoginIcon predefined. Let's define a LoginIcon or just use LogoutIcon but flip it... actually let's just use LogoutIcon for now to save time, or I can add a simple svg for login. */}
              {!isCollapsed && <span>Login</span>}
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}