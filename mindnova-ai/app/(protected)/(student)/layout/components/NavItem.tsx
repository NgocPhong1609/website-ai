"use client";

import React from "react";
import { SidebarItem } from "@/src/components/ui";
import { NAV_ICON_MAP } from "../constants/navIcons";
import type { NavIconKey } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItemProps {
  label: string;
  iconKey: NavIconKey;
  href: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NavItem({ label, iconKey, href }: NavItemProps) {
  const Icon = NAV_ICON_MAP[iconKey];

  return (
    <SidebarItem
      href={href}
      label={label}
      icon={<Icon />}
    />
  );
}
