import type { SidebarMenuItem } from "@/src/components/page/student/layout/types";

// ─── Navigation Data ──────────────────────────────────────────────────────────

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { label: "Dashboard", iconKey: "dashboard", href: "/" },
  { label: "My Courses", iconKey: "courses", href: "/courses" },
  { label: "AI Study Plan", iconKey: "study-plan", href: "/study-plan" },
  { label: "Practice", iconKey: "practice", href: "/practice" },
  { label: "Progress", iconKey: "progress", href: "/progress" },
  { label: "History", iconKey: "history", href: "/history" },
  { label: "Profile", iconKey: "profile", href: "/profile" },
  { label: "Billing", iconKey: "billing", href: "/billing" },
];
