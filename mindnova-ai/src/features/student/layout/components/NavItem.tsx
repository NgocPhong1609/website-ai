"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { NAV_ICON_MAP } from "@/src/features/student/layout/constants/navIcons";
import type { NavIconKey } from "@/src/features/student/layout/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItemProps {
  label: string;
  iconKey: NavIconKey;
  href: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NavItem({ label, iconKey, href }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = NAV_ICON_MAP[iconKey];

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={twMerge(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
        "transition-all duration-150",
        isActive
          ? "bg-[#6B6BFF]/10 text-[#4648D4]"
          : "text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E]",
      )}
    >
      {/* Active indicator bar */}
      <span
        className={twMerge(
          "absolute left-0 w-[3px] h-6 rounded-r-full bg-[#6B6BFF] transition-all duration-200",
          isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
        )}
      />

      {/* Icon wrapper */}
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
          isActive
            ? "bg-[#6B6BFF]/15 text-[#6B6BFF]"
            : "text-[#9090B0] group-hover:text-[#4648D4] group-hover:bg-[#6B6BFF]/8",
        )}
      >
        <Icon />
      </span>

      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}
