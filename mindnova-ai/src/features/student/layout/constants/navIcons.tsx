import type { FC } from "react";
import type { NavIconKey } from "@/src/features/student/layout/types";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  Compass,
  CreditCard,
  History,
  Layers,
  LayoutDashboard,
  User,
  type LucideProps,
} from "lucide-react";

function icon(Icon: typeof LayoutDashboard) {
  return function NavLucideIcon(props: LucideProps) {
    return <Icon width={18} height={18} strokeWidth={1.8} aria-hidden {...props} />;
  };
}

export const NAV_ICON_MAP: Record<NavIconKey, FC<LucideProps>> = {
  dashboard: icon(LayoutDashboard),
  explore: icon(Compass),
  courses: icon(BookOpen),
  "study-plan": icon(Layers),
  practice: icon(ClipboardCheck),
  progress: icon(Activity),
  history: icon(History),
  profile: icon(User),
  billing: icon(CreditCard),
};
