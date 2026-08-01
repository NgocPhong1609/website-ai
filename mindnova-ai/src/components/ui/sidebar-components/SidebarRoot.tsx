"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useSidebar } from "./context";
import { MenuHamburgerIcon } from "./icons";
import { SidebarMenuItem } from "./SidebarItem";
import { SidebarSubMenu } from "./SidebarSubMenu";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarToggleButton,
} from "./SidebarSections";
import type { SidebarProps, SidebarItemConfig } from "./types";

function renderItem(item: SidebarItemConfig, idx: number) {
  const key = `item-${idx}-${typeof item.label === "string" ? item.label : idx}`;
  if (item.children?.length) {
    return (
      <SidebarSubMenu key={key} icon={item.icon} label={item.label} items={item.children} isActive={item.isActive} />
    );
  }
  const { children: _children, ...itemProps } = item;
  return <SidebarMenuItem key={key} {...itemProps} />;
}

/**
 * Sidebar — Clean & Optimal
 *
 * Behavior:
 *  - Desktop: w-72 (open) ↔ w-0 (closed), smooth 300ms CSS transition
 *  - Mobile : fixed drawer slide-in từ trái, backdrop overlay
 *
 * Toggle:
 *  - Nút ☰ trong SidebarHeader (khi sidebar mở)
 *  - Nút ☰ trong Topbar (khi sidebar đóng) — do cha render
 *  - Phím Ctrl+B
 */
export function Sidebar({
  groups,
  items,
  header,
  footer,
  cta,
  children,
  className,
  width = "w-[234px]",
  ...props
}: SidebarProps) {
  const { isOpen, isMobileOpen, setMobileOpen } = useSidebar();

  // Đóng mobile sidebar bằng Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen, setMobileOpen]);

  const isDataDriven = Boolean(groups || items || header || footer || cta);

  const sidebarContent = isDataDriven ? (
    <>
      {/* Header với nút ☰ */}
      <SidebarHeader showToggle>{header}</SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        {groups?.map((g, gi) => (
          <SidebarGroup key={`g-${gi}`} className={g.className}>
            {g.title && <SidebarGroupLabel>{g.title}</SidebarGroupLabel>}
            <SidebarMenu>{g.items.map(renderItem)}</SidebarMenu>
          </SidebarGroup>
        ))}
        {items && !groups && (
          <SidebarMenu>{items.map(renderItem)}</SidebarMenu>
        )}
        {cta && <div className="mt-3">{cta}</div>}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {footer}
        <SidebarToggleButton />
      </SidebarFooter>
    </>
  ) : children;

  return (
    <>
      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside
        aria-label="Sidebar"
        className={twMerge(
          // Base
          "hidden md:flex flex-col shrink-0",
          "bg-white border-r border-[#E8E8F0]",
          "overflow-hidden",
          // Smooth width transition — đây là toàn bộ "magic"
          "transition-[width] duration-300 ease-in-out",
          isOpen ? `${width}` : "w-0",
          // Khi w-0: ẩn border để không còn đường viền thừa
          !isOpen && "border-r-0",
          className
        )}
        {...props}
      >
        {/* Inner: fixed width để content không bị squeeze trong quá trình transition */}
        <div className={twMerge("flex flex-col h-full", width, "shrink-0")}>
          {sidebarContent}
        </div>
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={twMerge(
          "fixed top-0 left-0 bottom-0 z-50 flex flex-col md:hidden",
          "bg-white border-r border-[#E8E8F0] shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          width,
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#E8E8F0] shrink-0">
          <div className="flex-1 overflow-hidden">{header}</div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#525266] hover:bg-gray-100 transition-colors shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile nav content */}
        <SidebarContent>
          {groups?.map((g, gi) => (
            <SidebarGroup key={`mg-${gi}`} className={g.className}>
              {g.title && <SidebarGroupLabel>{g.title}</SidebarGroupLabel>}
              <SidebarMenu>{g.items.map(renderItem)}</SidebarMenu>
            </SidebarGroup>
          ))}
          {items && !groups && <SidebarMenu>{items.map(renderItem)}</SidebarMenu>}
          {cta && <div className="mt-3">{cta}</div>}
        </SidebarContent>

        {footer && <SidebarFooter>{footer}</SidebarFooter>}
      </div>
    </>
  );
}

/**
 * SidebarOpenButton — đặt trong Topbar để mở lại sidebar khi đã đóng
 */
export function SidebarOpenButton({ className }: { className?: string }) {
  const { isOpen, toggle, toggleMobile } = useSidebar();
  return (
    <>
      {/* Desktop: chỉ hiện khi sidebar đóng */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Mở Sidebar"
        title="Mở Sidebar (Ctrl+B)"
        className={twMerge(
          "hidden md:flex w-9 h-9 items-center justify-center rounded-xl",
          "text-[#525266] hover:bg-[#F4F4FA] hover:text-[#4648D4]",
          "transition-all duration-200",
          isOpen ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100",
          className
        )}
      >
        <MenuHamburgerIcon size={20} />
      </button>

      {/* Mobile: luôn hiện */}
      <button
        type="button"
        onClick={toggleMobile}
        aria-label="Mở menu điều hướng"
        className={twMerge(
          "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
          "text-[#525266] hover:bg-[#F4F4FA] hover:text-[#4648D4]",
          "transition-colors",
          className
        )}
      >
        <MenuHamburgerIcon size={20} />
      </button>
    </>
  );
}
