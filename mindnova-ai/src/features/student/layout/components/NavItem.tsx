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
 "group relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium",
 "transition-all duration-150",
 isCollapsed ? "justify-center" : "gap-3",
 isActive
 ? "bg-[#C0392B]/8 text-[#C0392B]"
 : "text-[#8A8478] hover:bg-[#F5F0E8] hover:text-[#2C3039]",
 )}
 >
 {/* Active indicator bar */}
 <span
 className={twMerge(
 "absolute left-0 w-[3px] h-5 rounded-r-full bg-[#C0392B] transition-all duration-200",
 isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
 )}
 />

 {/* Icon wrapper */}
 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 shrink-0",
 isActive
 ? "bg-[#C0392B]/10 text-[#C0392B]"
 : "text-[#B8B0A3] group-hover:text-[#C0392B] group-hover:bg-[#C0392B]/5",
 )}
 >
 <Icon />
 </span>

 {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
 </Link>
 );
}
