export type NavIconKey =
  | "dashboard"
  | "courses"
  | "study-plan"
  | "practice"
  | "progress"
  | "history"
  | "profile"
  | "billing";

export interface SidebarMenuItem {
  label: string;
  iconKey: NavIconKey;
  href: string;
}
