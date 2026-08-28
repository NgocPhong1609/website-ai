import type { UserProfile, ProfileTabItem } from "../types";

// ─── Mock localized user data ──────────────────────────────────────────────────

export const USER_PROFILE: UserProfile = {
 fullName: "Nguyễn Ngọc Phong",
 email: "ngocphong.ai@edu.mindnova.vn",
 bio: "Đam mê nghiên cứu Trí tuệ Nhân tạo và Kiến trúc Kỹ thuật Phần mềm. Hiện đang rèn luyện chuyên sâu các mô hình Deep Learning và LLM tại MindNova AI.",
 major: "Chuyên ngành Kỹ thuật AI & Phần mềm",
 avatarInitials: "NP",
 completionPercent: 85,
};

// ─── Profile Tab Menu ─────────────────────────────────────────────────────────

export const PROFILE_TABS: ProfileTabItem[] = [
 { id: "personal-info", label: "Thông tin cá nhân", iconKey: "personal-info" },
 { id: "security", label: "Bảo mật & Mật khẩu", iconKey: "security" },
 { id: "settings", label: "Cài đặt thông báo", iconKey: "settings" },
];
