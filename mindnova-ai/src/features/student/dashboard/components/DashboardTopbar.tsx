"use client";

import React, { useState, useEffect } from "react";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function DashboardTopbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component được tải lên trình duyệt
  useEffect(() => {
    setIsMounted(true);
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);//không phải bị lỗi đâu đừng có xóa

  return (
    <header className="sticky top-0 z-30 h-18 shrink-0 flex items-center justify-between gap-4 px-6 lg:px-8 bg-white/90 backdrop-blur-xl border-b border-[#F0F0F8] shadow-2xs transition-all duration-200">
      {/* Interactive Luminous Search */}
      <div className="flex-1 max-w-md relative group">
        <div className="absolute inset-y-0 left-3.5 flex items-center text-[#9090B0] group-focus-within:text-[#4648D4] transition-colors pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          placeholder="Search courses, lessons, or ask AI..."
          className="w-full pl-10 pr-12 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F6F6FB] border border-[#EAEAF4]/80 focus:border-[#6B6BFF] focus:bg-white focus:ring-4 focus:ring-[#6B6BFF]/15 text-[#1A1A2E] placeholder-[#9090B0] transition-all focus:outline-none shadow-inner"
        />
        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
          <span className="px-1.5 py-0.5 text-[10px] text-[#7878A0] font-mono bg-white rounded border border-[#EAEAF4] shadow-2xs">⌘K</span>
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-[#F6F6FB] p-1 rounded-xl border border-[#EAEAF4]">
          {/* Notifications with lively pulse */}
          <button
            type="button"
            aria-label="Notifications"
            className="group/bell relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64647A] hover:text-[#4648D4] hover:bg-white hover:shadow-2xs transition-all duration-200 focus:outline-none"
          >
            <div className="group-hover/bell:rotate-12 transition-transform duration-200">
              <BellIcon />
            </div>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white" />
          </button>

          {/* Settings */}
          <button
            type="button"
            aria-label="Settings"
            className="group/settings w-9 h-9 rounded-lg flex items-center justify-center text-[#64647A] hover:text-[#4648D4] hover:bg-white hover:shadow-2xs transition-all duration-200 focus:outline-none"
          >
            <div className="group-hover/settings:rotate-45 transition-transform duration-300">
              <SettingsIcon />
            </div>
          </button>
        </div>

        <span className="w-px h-6 bg-[#EAEAF4] hidden sm:block" />

        {/* Dynamic Interactive Avatar */}
        <div className="relative group">
          <button
            type="button"
            aria-label="User profile"
            className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-xs font-bold shadow-sm hover:shadow-[0_4px_12px_rgba(107,107,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none ring-2 ring-white"
          >
            MN
          </button>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white shadow-xs animate-pulse" title="Online" />
        </div>
      </div>
    </header>
  );
}




