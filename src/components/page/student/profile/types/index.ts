// ─── Profile Feature — Types ──────────────────────────────────────────────────

export type ProfileTab = "personal-info" | "security" | "settings";

export interface ProfileTabItem {
  id: ProfileTab;
  label: string;
  iconKey: ProfileTabIconKey;
}

export type ProfileTabIconKey = "personal-info" | "security" | "settings";

export interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  major: string;
  avatarInitials: string;
  completionPercent: number;
}
