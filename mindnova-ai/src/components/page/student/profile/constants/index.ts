import type { UserProfile, ProfileTabItem } from "../types";

// ─── Mock user data ───────────────────────────────────────────────────────────

export const USER_PROFILE: UserProfile = {
  fullName: "Alex Rivera",
  email: "alex.rivera@edu.mindnova.ai",
  bio: "Passionate about AI ethics and machine learning. Currently specializing in NLP at the Global Institute of Tech.",
  major: "Computer Science Major",
  avatarInitials: "AR",
  completionPercent: 85,
};

// ─── Profile Tab Menu ─────────────────────────────────────────────────────────

export const PROFILE_TABS: ProfileTabItem[] = [
  { id: "personal-info", label: "Personal Info", iconKey: "personal-info" },
  { id: "security",      label: "Security",      iconKey: "security"       },
  { id: "settings",      label: "Settings",      iconKey: "settings"       },
];
