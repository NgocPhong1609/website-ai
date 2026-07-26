"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import type { ProfileTab } from "./types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";
import { useAvatarUpload } from "@/src/hooks/useAvatarUpload";

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
// 'use client' — avatar upload uses useRef and onChange handlers.

function ProfileAvatar({ name }: { name: string }) {
  const { previewUrl, uploadError, isUploading, fileInputRef, triggerFilePicker, handleFileChange } =
    useAvatarUpload();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative mx-auto w-fit">
      {/* Hidden file input — JPG/PNG only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload profile avatar"
      />

      {/* Avatar circle */}
      <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] shadow-[0_6px_24px_rgba(107,107,255,0.45)]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#2D2D5E] flex items-center justify-center overflow-hidden">
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : previewUrl ? (
            <Image src={previewUrl} alt={`${name} avatar`} width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white tracking-wider select-none">{initials}</span>
          )}
        </div>
      </div>

      {/* Edit button */}
      <button
        type="button"
        onClick={triggerFilePicker}
        className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-[#6B6BFF] border-2 border-white flex items-center justify-center shadow-md hover:bg-[#4648D4] transition-colors"
        title="Upload avatar (JPG/PNG, max 5MB)"
        aria-label="Change avatar"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {/* Upload error */}
      {uploadError && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 z-10">
          <p className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 text-center leading-tight shadow-sm">
            {uploadError.message}
          </p>
        </div>
      )}
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileSidebar({
  activeTab,
  onTabChange,
  fullName,
  major,
}: ProfileSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 pt-4 pb-2">
        <ProfileAvatar name={fullName} />
        {/* Spacer for potential error tooltip */}
        <div className="mt-3 text-center">
          <p className="text-base font-bold text-[#1A1A2E] leading-tight">{fullName}</p>
          <p className="text-xs text-[#9090B0] mt-0.5">{major}</p>
        </div>
        <p className="text-[10px] text-[#B0B0C8] text-center">JPG or PNG · Max 5MB</p>
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
