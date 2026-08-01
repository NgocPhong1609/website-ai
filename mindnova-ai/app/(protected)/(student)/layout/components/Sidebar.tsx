"use client";

import React from "react";
import {
  Sidebar as RootSidebar,
  type SidebarGroupConfig,
} from "@/src/components/ui";
import { SidebarBrand } from "./SidebarBrand";
import { SIDEBAR_MENU } from "../constants/data-menu";
import { NAV_ICON_MAP } from "../constants/navIcons";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UpgradeProCTA() {
  return (
    <div className="px-1 py-2 shrink-0">
      <button
        type="button"
        title="Upgrade to Pro"
        className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <span className="shrink-0 text-white animate-pulse">
          <SparkleIcon />
        </span>
        <span className="truncate tracking-wide uppercase">UPGRADE TO PRO</span>
      </button>
    </div>
  );
}

// ─── Main Data-Driven Sidebar ─────────────────────────────────────────────────

export function Sidebar() {
  const handleLogout = () => {
    window.localStorage.clear();
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.assign("/login");
  };

  // TRUYỀN DATA BẰNG PROPS (Data-driven Configuration)
  const navigationGroups: SidebarGroupConfig[] = [
    {
      title: "ĐIỀU HÀNH & HỌC TẬP",
      items: SIDEBAR_MENU.map((item) => {
        const IconComponent = NAV_ICON_MAP[item.iconKey];
        return {
          label: item.label,
          href: item.href,
          icon: <IconComponent />,
        };
      }),
    },
    {
      title: "HỆ THỐNG & TÀI KHOẢN",
      items: [
        {
          label: "Trợ giúp",
          href: "/help",
          icon: <HelpIcon />,
        },
        {
          label: "Đăng xuất",
          icon: <LogoutIcon />,
          onClick: handleLogout,
          className: "text-red-600 hover:bg-red-50 hover:text-red-700 font-bold",
        },
      ],
    },
  ];

  return (
    <RootSidebar
      header={<SidebarBrand />}
      groups={navigationGroups}
      cta={<UpgradeProCTA />}
    />
  );
}