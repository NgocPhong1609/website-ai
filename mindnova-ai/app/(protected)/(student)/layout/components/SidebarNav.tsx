"use client";

import React from "react";
import { SidebarContent, SidebarMenu, SidebarGroup, SidebarGroupLabel } from "@/src/components/ui";
import { SIDEBAR_MENU } from "../constants/data-menu";
import { NavItem } from "./NavItem";

/**
 * Renders the scrollable navigation list using reusable UI Sidebar components.
 * Each NavItem resolves its own active state via usePathname internally.
 */
export function SidebarNav() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>ĐIỀU HÀNH & HỌC TẬP</SidebarGroupLabel>
        <SidebarMenu>
          {SIDEBAR_MENU.map((item) => (
            <NavItem
              key={item.href}
              label={item.label}
              iconKey={item.iconKey}
              href={item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
