"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect, useState } from "react";
import Link from "next/link";
=======
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// ─── DashboardTopbar ─────────────────────────────────────────────────────────
// Top search + actions bar for the dashboard layout.
>>>>>>> 6cd68b158bdea860a333852fe76da13a4cf0331b
=======
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede

// ─── Icons ───────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ─── Mock Notifications Data ──────────────────────────────────────────────────

interface INotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "cert" | "security" | "support";
  unread: boolean;
  link?: string;
}

const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: "notif-1",
    title: "Certificate Eligibility Unlocked!",
    description: "You achieved 100% completion in Neural Networks with an average score of 92%. Claim your verified certificate now.",
    timestamp: "10m ago",
    type: "cert",
    unread: true,
    link: "/certificates",
  },
  {
    id: "notif-2",
    title: "Instructor Resolved Issue #101",
    description: "Your reported typo in Lesson #101 (Route Handlers) has been corrected. Thank you for maintaining course rigor!",
    timestamp: "1h ago",
    type: "support",
    unread: true,
    link: "/history",
  },
  {
    id: "notif-3",
    title: "Password Updated",
    description: "Your password was recently modified. All active sessions on other devices have been automatically revoked.",
    timestamp: "1d ago",
    type: "security",
    unread: false,
    link: "/profile",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
// 'use client' leaf component for dropdown toggling and read state.

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="flex-1 max-w-md relative">
      <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses, topics, or AI help…"
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
      />
    </div>
  );
}

export function DashboardTopbar() {
<<<<<<< HEAD
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
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <Suspense fallback={<div className="flex-1 max-w-md relative" />}>
        <SearchInput />
      </Suspense>

      <div className="flex-1" />

      {/* Actions / Auth Buttons */}
      <div className="flex items-center gap-2">
        {!isMounted ? (
           // Skeleton loading khi đang kiểm tra token
           <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        ) : isLoggedIn ? (
          // Đã đăng nhập: Hiện Avatar và chuông thông báo
          <>
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
              <BellIcon />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 border-2 border-white" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all">
              <SettingsIcon />
            </button>
            <button className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] hover:shadow-[0_4px_14px_rgba(107,107,255,0.5)] transition-all">
              H
            </button>
          </>
        ) : (
          // Chưa đăng nhập: Hiện nút Đăng nhập / Đăng ký
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-[#1A1A2E] hover:text-[#6B6BFF] transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] rounded-xl hover:shadow-[0_4px_18px_rgba(107,107,255,0.45)] transition-all">
              Đăng ký
            </Link>
          </div>
        )}
=======
  const [notifications, setNotifications] = useState<INotification[]>(MOCK_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8] relative z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          placeholder="Search courses, topics, or AI help…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
      </div>

      <div className="flex-1" />

      {/* Action Controls */}
      <div className="flex items-center gap-2 relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white animate-pulse" />
          )}
        </button>

        {/* Notifications Dropdown */}
        {isOpen && (
          <div className="absolute right-12 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-[#EAEAF4] shadow-[0_12px_36px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 border-b border-[#F0F0F8] flex items-center justify-between bg-[#F4F4FA]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1A1A2E]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6B6BFF] text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[#6B6BFF] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#F0F0F8]">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                    );
                  }}
                  className={`p-4 transition-colors hover:bg-[#F8F8FC] flex flex-col gap-1 cursor-pointer ${
                    notif.unread ? "bg-[#F0F0FF]/40" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1.5">
                      {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] shrink-0" />}
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-[#A0A0C0] shrink-0 font-medium">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#64647A] leading-relaxed pl-3">{notif.description}</p>
                  {notif.link && (
                    <Link href={notif.link} onClick={() => setIsOpen(false)} className="text-[11px] font-bold text-[#6B6BFF] hover:underline mt-1 pl-3 w-fit">
                      View details →
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#F8F8FC] border-t border-[#F0F0F8] text-center">
              <Link
                href="/history"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#6B6BFF] hover:text-[#4648D4] transition-colors"
              >
                View full activity log
              </Link>
            </div>
          </div>
        )}

        {/* Settings Button */}
        <Link
          href="/profile"
          aria-label="Settings"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <SettingsIcon />
        </Link>

        {/* Avatar Button */}
        <Link
          href="/profile"
          aria-label="User profile"
          className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] hover:shadow-[0_4px_14px_rgba(107,107,255,0.5)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
        >
          H
        </Link>
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede
      </div>
    </header>
  );
}