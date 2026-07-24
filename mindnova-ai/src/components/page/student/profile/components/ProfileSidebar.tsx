"use client";

import { twMerge } from "tailwind-merge";
import type { ProfileTab } from "../types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";

// ─── Tab Icon Map ─────────────────────────────────────────────────────────────

const TAB_ICON_MAP = {
  "personal-info": PersonalInfoIcon,
  security: SecurityIcon,
  settings: SettingsIcon,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  fullName: string;
  major: string;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ProfileAvatar({ name }: { name: string }) {
  return (
    <div className="relative mx-auto w-fit">
      {/* Gradient ring */}
      <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] shadow-[0_6px_24px_rgba(107,107,255,0.45)]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#2D2D5E] flex items-center justify-center">
          <span className="text-2xl font-bold text-white tracking-wider select-none">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
      </div>
      {/* Verified badge */}
      <span className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-[#6B6BFF] border-2 border-white flex items-center justify-center shadow-md">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

interface TabButtonProps {
  id: ProfileTab;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ id, label, isActive, onClick }: TabButtonProps) {
  const Icon = TAB_ICON_MAP[id];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={twMerge(
        "group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-[#6B6BFF] text-white shadow-[0_4px_14px_rgba(107,107,255,0.35)]"
          : "text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E]",
      )}
    >
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150",
          isActive
            ? "bg-white/20 text-white"
            : "bg-[#F0F0F8] text-[#9090B0] group-hover:bg-[#6B6BFF]/10 group-hover:text-[#4648D4]",
        )}
      >
        <Icon />
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProfileSidebar({
  activeTab,
  onTabChange,
  fullName,
  major,
}: ProfileSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <ProfileAvatar name={fullName} />
        <div className="text-center">
          <p className="text-base font-bold text-[#1A1A2E] leading-tight">{fullName}</p>
          <p className="text-xs text-[#9090B0] mt-0.5">{major}</p>
        </div>
      </div>

      {/* Tab navigation */}
      <nav aria-label="Profile sections" className="flex flex-col gap-1">
        <TabButton
          id="personal-info"
          label="Personal Info"
          isActive={activeTab === "personal-info"}
          onClick={() => onTabChange("personal-info")}
        />
        <TabButton
          id="security"
          label="Security"
          isActive={activeTab === "security"}
          onClick={() => onTabChange("security")}
        />
        <TabButton
          id="settings"
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => onTabChange("settings")}
        />
      </nav>
    </div>
  );
}
