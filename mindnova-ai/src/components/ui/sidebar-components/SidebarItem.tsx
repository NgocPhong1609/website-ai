"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useSidebar } from "./context";
import type { SidebarMenuItemProps } from "./types";

/**
 * SidebarMenuItem — Nav link chuẩn mực
 * Không còn isCollapsed logic: sidebar luôn full-width khi hiển thị.
 * Active state tự detect theo pathname.
 */
export function SidebarMenuItem({
  href,
  onClick,
  icon,
  label,
  badge,
  isActive: propIsActive,
  disabled = false,
  className,
  ...props
}: SidebarMenuItemProps) {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  const isActive =
    propIsActive !== undefined
      ? propIsActive
      : href && pathname
      ? pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
      : false;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (disabled) { e.preventDefault(); return; }
    if (onClick) onClick(e);
    // Đóng mobile drawer khi navigate
    if (href && typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  const baseClass = twMerge(
    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left",
    "transition-all duration-150 select-none outline-none",
    // Default
    "text-[#525266] hover:bg-[#F4F4FA] hover:text-gray-900",
    // Active
    isActive && !disabled && "bg-[#EEF0FF] text-[#4648D4] font-bold",
    // Disabled
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      {icon && (
        <span className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors",
          isActive ? "text-[#4648D4]" : "text-[#9090B0] group-hover:text-[#4648D4]"
        )}>
          {icon}
        </span>
      )}

      <span className="flex-1 text-sm font-semibold truncate">{label}</span>

      {badge !== undefined && (
        <span className={twMerge(
          "px-2 py-0.5 text-[11px] font-bold rounded-full shrink-0",
          isActive
            ? "bg-[#4648D4] text-white"
            : "bg-gray-100 text-gray-600 border border-gray-200"
        )}>
          {badge}
        </span>
      )}
    </>
  );

  return (
    <li>
      {href && !disabled ? (
        <Link
          href={href}
          onClick={handleClick}
          aria-current={isActive ? "page" : undefined}
          className={baseClass}
          {...props}
        >
          {content}
        </Link>
      ) : (
        <button type="button" onClick={handleClick} disabled={disabled} className={baseClass}>
          {content}
        </button>
      )}
    </li>
  );
}

export const SidebarItem = SidebarMenuItem;
