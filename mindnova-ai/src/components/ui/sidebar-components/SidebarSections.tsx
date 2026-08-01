"use client";

import React, { ReactNode, HTMLAttributes } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useSidebar } from "./context";
import { MenuHamburgerIcon, ChevronLeftIcon } from "./icons";
import type { SidebarHeaderProps, SidebarFooterProps } from "./types";

// ─── SidebarHeader ────────────────────────────────────────────────────────────

export function SidebarHeader({
  children,
  className,
  showToggle = true,
  ...props
}: SidebarHeaderProps) {
  const { toggle } = useSidebar();

  return (
    <div
      className={twMerge(
        "shrink-0 h-16 flex items-center justify-between gap-3 px-4",
        "border-b border-[#E8E8F0] bg-white",
        className
      )}
      {...props}
    >
      {/* Brand / Logo slot */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {children}
      </div>

      {/* Hamburger close button */}
      {showToggle && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Thu gọn Sidebar (Ctrl+B)"
          title="Thu gọn (Ctrl+B)"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-[#525266] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border border-transparent hover:border-gray-200"
        >
          <MenuHamburgerIcon size={20} />
        </button>
      )}
    </div>
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────

export function SidebarContent({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={twMerge(
        "flex-1 overflow-y-auto overflow-x-hidden py-3 px-2",
        "space-y-4 custom-scrollbar",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

// ─── SidebarGroup ─────────────────────────────────────────────────────────────

export function SidebarGroup({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("space-y-0.5", className)} {...props}>
      {children}
    </div>
  );
}

// ─── SidebarGroupLabel ────────────────────────────────────────────────────────

export function SidebarGroupLabel({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-[#A0A0C0] select-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── SidebarMenu ─────────────────────────────────────────────────────────────

export function SidebarMenu({ children, className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={twMerge("list-none m-0 p-0 space-y-0.5", className)} {...props}>
      {children}
    </ul>
  );
}

// ─── SidebarFooter ────────────────────────────────────────────────────────────

export function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={twMerge(
        "shrink-0 p-3 border-t border-[#E8E8F0] bg-gray-50/60 space-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── SidebarToggleButton ──────────────────────────────────────────────────────

export function SidebarToggleButton({ className }: { className?: string }) {
  const { isOpen, toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Thu gọn Sidebar (Ctrl+B)" : "Mở rộng Sidebar (Ctrl+B)"}
      title={isOpen ? "Thu gọn (Ctrl+B)" : "Mở rộng (Ctrl+B)"}
      className={twMerge(
        "group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
        "text-[#525266] text-sm font-bold",
        "hover:bg-gray-100 hover:text-gray-900 transition-all duration-200",
        "border border-gray-200 bg-white",
        className
      )}
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-[#4648D4] group-hover:text-white text-gray-600 transition-colors shrink-0">
        <ChevronLeftIcon size={14} />
      </span>
      <span className="truncate">Thu gọn</span>
      <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded shrink-0">
        Ctrl+B
      </kbd>
    </button>
  );
}

// ─── SidebarMobileTrigger ─────────────────────────────────────────────────────

export function SidebarMobileTrigger({ className, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { toggleMobile } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleMobile}
      aria-label="Mở menu điều hướng"
      className={twMerge(
        "md:hidden p-2 rounded-xl text-[#4648D4]",
        "hover:bg-gray-100 transition-colors",
        className
      )}
      {...props}
    >
      <MenuHamburgerIcon size={22} />
    </button>
  );
}

// ─── SidebarLogo ─────────────────────────────────────────────────────────────

export function SidebarLogo({
  href = "/",
  logoText = "MindNova AI",
  subText,
  icon,
  className,
}: {
  href?: string;
  logoText?: string;
  subText?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const logoMark = icon || (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4648D4] to-[#383AB8] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
      M
    </div>
  );

  return (
    <Link
      href={href}
      className={twMerge(
        "flex items-center gap-3 overflow-hidden rounded-xl py-0.5",
        "text-gray-900 hover:opacity-90 transition-opacity group",
        className
      )}
    >
      <span className="shrink-0">{logoMark}</span>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[15px] font-black text-gray-900 tracking-tight truncate group-hover:text-[#4648D4] transition-colors">
          {logoText}
        </span>
        {subText && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
            {subText}
          </span>
        )}
      </div>
    </Link>
  );
}
