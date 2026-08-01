import { ReactNode, HTMLAttributes, AnchorHTMLAttributes, MouseEvent } from "react";

// ─── ITEM & GROUP CONFIG ───────────────────────────────────────────────────────

export interface SidebarItemConfig {
  label: string | ReactNode;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode | string | number;
  disabled?: boolean;
  isActive?: boolean;
  children?: SidebarItemConfig[];
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
}

export interface SidebarGroupConfig {
  title?: string;
  items: SidebarItemConfig[];
  className?: string;
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

export interface SidebarContextType {
  isOpen: boolean;       // desktop: sidebar mở hay đóng
  isMobileOpen: boolean; // mobile: drawer mở hay đóng
  toggle: () => void;
  toggleMobile: () => void;
  setMobileOpen: (v: boolean) => void;
  // backward-compat aliases
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (v: boolean) => void;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

// ─── COMPONENT PROPS ──────────────────────────────────────────────────────────

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  groups?: SidebarGroupConfig[];
  items?: SidebarItemConfig[];
  header?: ReactNode;
  footer?: ReactNode;
  cta?: ReactNode;
  children?: ReactNode;
  width?: string;
  className?: string;
}

export interface SidebarMenuItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "label"> {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
  badge?: ReactNode | string | number;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface SidebarSubMenuProps {
  icon?: ReactNode;
  label: string | ReactNode;
  children?: ReactNode;
  items?: SidebarItemConfig[];
  defaultOpen?: boolean;
  isActive?: boolean;
  className?: string;
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  showToggle?: boolean;
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
