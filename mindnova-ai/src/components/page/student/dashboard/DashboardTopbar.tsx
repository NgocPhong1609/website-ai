"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { SidebarOpenButton, ActorSwitcher } from "@/src/components/ui";

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
    const currentSearch = searchParams.get("search") || "";
    // GUARD: Nếu từ khóa không thay đổi, TUYỆT ĐỐI KHÔNG gọi router.replace để loại bỏ vòng lặp re-render vô tận!
    if (currentSearch === searchTerm.trim()) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>(MOCK_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Kiểm tra trạng thái đăng nhập khi component được tải lên trình duyệt
  useEffect(() => {
    setIsMounted(true);
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);//không phải bị lỗi đâu đừng có xóa

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
    <header className="h-16 shrink-0 flex items-center gap-3 px-5 bg-white border-b border-gray-200 relative z-30 shadow-2xs">
      {/* Nút mở lại sidebar trên desktop */}
      <SidebarOpenButton />

      {/* Search */}
      <Suspense fallback={<div className="flex-1 max-w-md relative" />}>
        <SearchInput />
      </Suspense>

      <div className="flex-1" />

      {/* Actions / Auth Buttons */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <ActorSwitcher />

        {!isMounted ? (
           // Skeleton loading khi đang kiểm tra token
           <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        ) : isLoggedIn ? (
           // Đã đăng nhập: Hiện Avatar và chuông thông báo
          <>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all duration-150 cursor-pointer shadow-2xs border border-gray-200"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
              <div className="absolute right-12 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#111827]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#4F46E5] text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                        );
                      }}
                      className={`p-4 transition-colors hover:bg-gray-50 flex flex-col gap-1 cursor-pointer ${
                        notif.unread ? "bg-[#EEF2FF]/50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />}
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-[#6B7280] shrink-0 font-medium">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed pl-3">{notif.description}</p>
                      {notif.link && (
                        <Link href={notif.link} onClick={() => setIsOpen(false)} className="text-[11px] font-extrabold text-[#4F46E5] hover:underline mt-1 pl-3 w-fit">
                          View details →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <Link
                    href="/history"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-extrabold text-[#4F46E5] hover:underline transition-colors"
                  >
                    View full activity log
                  </Link>
                </div>
              </div>
            )}

            <Link
              href="/profile"
              aria-label="Settings"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all duration-150 shadow-2xs border border-gray-200"
            >
              <SettingsIcon />
            </Link>

            <Link
              href="/profile"
              aria-label="User profile"
              className="w-9 h-9 rounded-xl overflow-hidden bg-[#4F46E5] flex items-center justify-center text-white text-sm font-extrabold shadow-sm hover:opacity-90 transition-all duration-150"
            >
              H
            </Link>
          </>
        ) : (
          // Chưa đăng nhập: Hiện nút Đăng nhập / Đăng ký
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-xs font-bold text-[#111827] hover:text-[#4F46E5] transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-4 py-2 text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-all">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}