"use client";

import { twMerge } from "tailwind-merge";
import { SIDEBAR_MENU } from "@/src/features/student/layout/constants/data-menu";
import { NavItem } from "./NavItem";

/**
 * Renders the scrollable navigation list.
 * Each NavItem resolves its own active state via usePathname internally.
 */
export function SidebarNav({ isCollapsed }: { isCollapsed?: boolean }) {
 return (
 <nav
 className={twMerge(
 "flex-1 overflow-y-auto px-3 py-2",
 isCollapsed && "scrollbar-hide"
 )}
 aria-label="Main navigation"
 >
 <ul className="flex flex-col gap-0.5">
 {SIDEBAR_MENU.map((item) => (
 <li key={item.href} className="relative">
 <NavItem
 label={item.label}
 iconKey={item.iconKey}
 href={item.href}
 isCollapsed={isCollapsed}
 />
 </li>
 ))}
 </ul>
 </nav>
 );
}
