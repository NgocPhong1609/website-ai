import type { SidebarMenuItem } from "@/src/features/student/layout/types";

// ─── Navigation Data ──────────────────────────────────────────────────────────

export const SIDEBAR_MENU: SidebarMenuItem[] = [
 { label: "Tổng quan", iconKey: "dashboard", href: "/" },
 { label: "Khám phá", iconKey: "explore", href: "/explore" },
 { label: "Khóa học của tôi", iconKey: "courses", href: "/courses" },
 { label: "Lộ trình AI", iconKey: "study-plan", href: "/study-plan" },
 { label: "Luyện tập", iconKey: "practice", href: "/practice" },
 { label: "Tiến độ", iconKey: "progress", href: "/progress" },
 { label: "Lịch sử", iconKey: "history", href: "/history" },
 { label: "Hồ sơ", iconKey: "profile", href: "/profile" },
 { label: "Thanh toán", iconKey: "billing", href: "/billing" },
];
