"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BellIcon } from "./icons";
import { SidebarOpenButton } from "@/src/components/ui";

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
    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-[13px] font-extrabold shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-all">
      MN
    </div>
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
    title: "⚠️ SLA Mentoring Alert (Section 5.1)",
    desc: "3 student Q&A discussions in 'UI/UX Design Masterclass' have exceeded the 24-hour response window.",
    type: "urgent",
    timestamp: "10 mins ago",
    actionText: "Open Q&A Inbox ➔",
    actionHref: "/instructor/discussions",
    read: false,
  },
  {
    id: "alt-2",
    title: "💰 Escrow Withholding Release Scheduled",
    desc: "15,400,000đ in student payments have completed their 30-day refund safety holding period and will move to Available Balance tonight.",
    type: "info",
    timestamp: "2 hours ago",
    actionText: "View Financials ➔",
    actionHref: "/instructor/revenue",
    read: false,
  },
  {
    id: "alt-3",
    title: "🔒 Data Protection Enforcement Active",
    desc: "Student export records and cohort analytics have automatically excluded passwords and sensitive financial billing attributes as required by Section 3.1.",
    type: "security",
    timestamp: "1 day ago",
    read: true,
  },
];

// Leaf UI Presentation Component for Section 5 Proactive Alert & Communication Center
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
    <header className="h-16 shrink-0 flex items-center justify-between px-5 bg-white border-b border-[#EAEAF4] relative z-40 shadow-2xs">
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        <SidebarOpenButton />
        <Link
          href="/instructor"
          className="text-[17px] font-extrabold text-[#4648D4] tracking-tight hover:text-[#3D40C0] transition-colors shrink-0"
        >
          MindNova Instructor Pro
        </Link>
        <span className="hidden sm:inline-block text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Section 5 Alert Center Enabled
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        
        {/* Proactive SLA Banner Indicator (Section 5.1) */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => setIsAlertOpen((p) => !p)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold animate-pulse transition-all cursor-pointer"
          >
            <span>🔥 {unreadCount} Active Mentoring SLA Alerts</span>
          </button>
        )}

        {/* Bell Button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Toggle Alert Center"
            onClick={() => setIsAlertOpen((p) => !p)}
            className={twMerge(
              "relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer",
              isAlertOpen ? "bg-[#1A1A2E] text-white shadow-md" : "bg-[#F6F6FB] text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            )}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Alert Dropdown (Section 5.1 & 5.2) */}
          {isAlertOpen && (
            <div className="absolute right-0 top-13 w-80 sm:w-96 rounded-3xl bg-white border border-[#EAEAF4] shadow-[0_20px_70px_rgba(0,0,0,0.2)] p-5 flex flex-col gap-4 z-50 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-black text-[#1A1A2E] flex items-center gap-2">
                    <span>🔔 Proactive Alert Center</span>
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      Section 5
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">Real-time mentoring SLA flags &amp; security checks</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-black text-[#6B6BFF] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    ✓ Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-10 text-center text-xs font-bold text-gray-400">
                    No system flags or active SLA alerts at this time.
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div
                      key={item.id}
                      className={twMerge(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 relative",
                        !item.read ? "bg-white border-indigo-200 shadow-xs" : "bg-gray-50 border-gray-100 opacity-80",
                        item.type === "urgent" && !item.read && "border-rose-300 bg-rose-50/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-black text-[#1A1A2E] leading-snug">{item.title}</span>
                        <button
                          type="button"
                          onClick={() => dismissAlert(item.id)}
                          className="text-gray-400 hover:text-red-500 font-extrabold text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-extrabold text-gray-400">{item.timestamp}</span>
                        {item.actionText && item.actionHref && (
                          <Link
                            href={item.actionHref}
                            onClick={() => setIsAlertOpen(false)}
                            className="text-[11px] font-extrabold text-[#5153DF] hover:underline flex items-center gap-1"
                          >
                            {item.actionText}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-extrabold text-gray-500">
                <span>🛡️ Student security data privacy active</span>
                <button
                  type="button"
                  onClick={() => setIsAlertOpen(false)}
                  className="text-gray-700 hover:text-black cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Help */}
        <button
          type="button"
          aria-label="Trợ giúp"
          className="w-10 h-10 rounded-2xl bg-[#F6F6FB] flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <HelpIcon />
        </button>

        {/* Avatar */}
        <UserAvatar />
      </div>
    </header>
  );
}
