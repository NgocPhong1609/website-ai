"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useSidebar } from "./context";
import { ChevronDownIcon } from "./icons";
import { SidebarMenuItem } from "./SidebarItem";
import type { SidebarSubMenuProps } from "./types";

/**
 * SidebarSubMenu — Accordion dropdown
 * Max-height CSS animation cho drawer mở/đóng mượt mà.
 */
export function SidebarSubMenu({
  icon,
  label,
  children,
  items,
  defaultOpen = false,
  isActive = false,
  className,
}: SidebarSubMenuProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || isActive);
  const { setMobileOpen } = useSidebar();

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsOpen(p => !p)}
        className={twMerge(
          "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
          "text-[#525266] font-semibold text-sm transition-all duration-150 select-none",
          "hover:bg-[#F4F4FA] hover:text-gray-900",
          isActive && "bg-[#EEF0FF] text-[#4648D4] font-bold",
          className
        )}
      >
        {icon && (
          <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-[#9090B0] group-hover:text-[#4648D4] transition-colors">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        <span className={twMerge(
          "shrink-0 text-gray-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )}>
          <ChevronDownIcon size={14} />
        </span>
      </button>

      {/* Accordion via max-height */}
      <div className={twMerge(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        <ul className="ml-4 pl-3 border-l-2 border-[#EAEAF4] mt-0.5 mb-1 space-y-0.5">
          {items?.map(({ children: _children, ...sub }, i) => (
            <SidebarMenuItem
              key={`sub-${i}`}
              {...sub}
              onClick={(e) => {
                if (sub.onClick) sub.onClick(e);
                if (sub.href && typeof window !== "undefined" && window.innerWidth < 768) {
                  setMobileOpen(false);
                }
              }}
            />
          )) ?? children}
        </ul>
      </div>
    </li>
  );
}
