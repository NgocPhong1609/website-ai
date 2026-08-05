"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { twMerge } from "tailwind-merge";
import { BellIcon } from "./icons";

const NAV_SVG = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function HelpIcon() {
  return (
    <svg {...NAV_SVG} width={18} height={18}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function UserAvatar() {
  return (
    <Avatar fallback="MN" size="sm" className="cursor-pointer hover:scale-105 transition-all shadow-sm shrink-0" />
  );
}

export interface AlertItem {
  id: string;
  title: string;
  desc: string;
  type: "urgent" | "info" | "security";
  timestamp: string;
  actionText?: string;
  actionHref?: string;
  read: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alt-1",
    title: "Thảo luận cần phản hồi (Mentoring SLA)",
    desc: "3 học viên đặt câu hỏi trong 'UI/UX Design Masterclass' đang chờ phản hồi từ bạn.",
    type: "urgent",
    timestamp: "10 phút trước",
    actionText: "Mở Hòm thư Hỏi đáp ➔",
    actionHref: "/instructor/discussions",
    read: false,
  },
  {
    id: "alt-2",
    title: "Chu kỳ thanh toán học phí hoàn tất",
    desc: "15,400,000đ từ doanh thu học phí đã hoàn tất thời gian bảo lưu 30 ngày và chuyển vào Số dư Khả dụng.",
    type: "info",
    timestamp: "2 giờ trước",
    actionText: "Xem Doanh thu ➔",
    actionHref: "/instructor/revenue",
    read: false,
  },
  {
    id: "alt-3",
    title: "Bảo mật dữ liệu học viên được kích hoạt",
    desc: "Hệ thống tự động mã hóa thông tin thanh toán và tài khoản của học viên trong các báo cáo xuất dữ liệu.",
    type: "security",
    timestamp: "1 ngày trước",
    read: true,
  },
];

export function InstructorTopbar() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200 relative z-40 shadow-2xs">
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        {/* Placeholder for sidebar open button if needed on mobile, removed SidebarOpenButton to avoid missing module error */}
        <button type="button" className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 bg-gray-50 text-[#6B7280]">
          <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <Link
          href="/instructor"
          className="text-lg font-black text-[#111827] tracking-tight hover:text-[#4F46E5] transition-colors shrink-0 flex items-center gap-2"
        >
          <span>MindNova Instructor</span>
          <span className="text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full border border-indigo-100">
            PRO
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        
        {/* Proactive SLA Badge (Clean style per Rule #7) */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => setIsAlertOpen((p) => !p)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-[#111827] border border-gray-200 hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-100 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{unreadCount} thảo luận mới</span>
          </button>
        )}

        {/* Bell Button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Toggle Alert Center"
            onClick={() => setIsAlertOpen((p) => !p)}
            className={twMerge(
              "relative w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 transition-all cursor-pointer",
              isAlertOpen ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-2xs" : "bg-gray-50 text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-100"
            )}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white px-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Alert Dropdown */}
          {isAlertOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-lg p-5 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                    <span>Thông báo Giảng viên</span>
                  </h3>
                  <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Cập nhật thảo luận & doanh thu</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-bold text-[#4F46E5] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-[#6B7280]">
                    Bạn không có thông báo mới nào.
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div
                      key={item.id}
                      className={twMerge(
                        "p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 relative",
                        !item.read ? "bg-[#F8FAFC] border-indigo-100 shadow-2xs" : "bg-white border-gray-100 opacity-70"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#111827] leading-snug">{item.title}</span>
                        <button
                          type="button"
                          onClick={() => dismissAlert(item.id)}
                          className="text-[#6B7280] hover:text-red-600 font-bold text-xs px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-gray-400">{item.timestamp}</span>
                        {item.actionText && item.actionHref && (
                          <Link
                            href={item.actionHref}
                            onClick={() => setIsAlertOpen(false)}
                            className="text-[11px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                          >
                            {item.actionText}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsAlertOpen(false)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Avatar */}
        <UserAvatar />
      </div>
    </header>
  );
}
