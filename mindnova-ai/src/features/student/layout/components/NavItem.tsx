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
 isCollapsed?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NavItem({ label, iconKey, href, isCollapsed }: NavItemProps) {
 const pathname = usePathname();
 const isActive = pathname === href;
 const Icon = NAV_ICON_MAP[iconKey];

 return (
 <Link
 href={href}
 title={isCollapsed ? label : undefined}
 aria-current={isActive ? "page" : undefined}
 className={twMerge(
 "group relative flex items-center rounded-lg text-sm font-medium",
 "transition-all duration-150",
 isCollapsed ? "w-10 h-10 justify-center mx-auto" : "px-3 py-2.5 gap-3",
 isActive
 ? "bg-blue-50 text-blue-600"
 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
 )}
 >
 {/* Active indicator bar */}
 <span
 className={twMerge(
 "absolute left-0 w-[3px] h-5 rounded-r-full bg-blue-600 transition-all duration-200",
 isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
 )}
 />

 {/* Icon wrapper */}
 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 shrink-0",
 isActive
 ? "bg-blue-100/50 text-blue-600"
 : "text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50",
 )}
 >
 <Icon />
 </span>

 {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
 </Link>
 );
}
