"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar as RootSidebar,
  SidebarLogo,
  type SidebarGroupConfig,
} from "@/src/components/ui";

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function CoursesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  );
}

function InvoicesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  const groups: SidebarGroupConfig[] = [
    {
      title: "Quản lý hệ thống",
      items: [
        {
          label: "Khóa học",
          href: "/admin/courses",
          icon: <CoursesIcon />,
          isActive: pathname?.startsWith("/admin/courses"),
        },
        {
          label: "Danh mục",
          href: "/admin/categories",
          icon: <CategoriesIcon />,
          isActive: pathname?.startsWith("/admin/categories"),
        },
        {
          label: "Hóa đơn & Thanh toán",
          href: "/admin/invoices",
          icon: <InvoicesIcon />,
          isActive: pathname?.startsWith("/admin/invoices"),
        },
        {
          label: "Thông báo",
          href: "/admin/notifications",
          icon: <NotificationsIcon />,
          isActive: pathname?.startsWith("/admin/notifications"),
        },
      ],
    },
  ];

  return (
    <RootSidebar
      width="w-[234px]"
      className="bg-white border-r border-gray-200"
      header={<SidebarLogo logoText="MindNova Admin" subText="Hệ thống quản trị" href="/admin/courses" />}
      groups={groups}
    />
  );
}
