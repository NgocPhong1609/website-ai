"use client";

import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ProfileTab } from "../types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";
import { PROFILE_TABS } from "../constants";
import { useUploadAvatar } from "../api";
import { writeStoredUser } from "@/src/shared/lib/userStorage";

const TAB_ICON_MAP = {
  "personal-info": PersonalInfoIcon,
  security: SecurityIcon,
  settings: SettingsIcon,
};

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  fullName: string;
  major: string;
  avatarUrl?: string | null;
}

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string | null;
  onClick?: () => void;
}

function ProfileAvatar({ name, avatarUrl, onClick }: ProfileAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(-2)
    .join("");

  return (
    <div className="relative mx-auto w-24 h-24 group cursor-pointer" onClick={onClick}>
      {/* Soft elegant avatar sphere */}
      <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#5052EE] via-[#6063EE] to-[#0D9488] p-[2px] shadow-2xs transition-all duration-300 group-hover:shadow-sm group-hover:-translate-y-0.5">
        <div className="w-full h-full rounded-2xl bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover rounded-[14px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.querySelector("span")?.removeAttribute("style");
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5052EE]/10 to-[#0D9488]/10" />
          <span
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4648D4] to-[#0D9488] bg-clip-text text-transparent select-none relative z-10"
            style={avatarUrl ? { display: "none" } : undefined}
          >
            {initials || "NP"}
          </span>

          {/* Hover Photo Upload Overlay */}
          <div className="absolute inset-0 bg-[#1A1A2E]/60 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 text-white">
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="text-[10px] font-medium">Đổi ảnh</span>
          </div>
        </div>
      </div>

      {/* Verified Online badge */}
      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#10B981] border-2 border-white flex items-center justify-center shadow-2xs z-30" title="Tài khoản đã được AI xác thực">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </div>
  );
}

interface TabButtonProps {
  id: ProfileTab;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ id, label, isActive, onClick }: TabButtonProps) {
  const Icon = TAB_ICON_MAP[id] || PersonalInfoIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={twMerge(
        "group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-normal transition-all duration-200 cursor-pointer overflow-hidden",
        isActive
          ? "bg-[#F0F2FF] text-[#5052EE] font-semibold shadow-2xs border border-[#6B6BFF]/20"
          : "text-[#64647A] hover:bg-[#F8FAFC] hover:text-[#1A1A2E] border border-transparent hover:border-[#EAEAF4]"
      )}
    >
      {/* Active Left Indicator Bar */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#5052EE]" />
      )}

      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 shrink-0",
          isActive
            ? "bg-white text-[#5052EE] shadow-2xs border border-[#5052EE]/15"
            : "bg-[#F4F5FB] text-[#7878A0] group-hover:bg-white group-hover:text-[#5052EE] shadow-2xs border border-transparent"
        )}
      >
        <Icon />
      </span>

      <span className="flex-1 text-left truncate">{label}</span>

      {/* Subtle indicator arrow for active tab */}
      <span className={twMerge("text-xs transition-opacity duration-200", isActive ? "opacity-100 text-[#5052EE]" : "opacity-0 group-hover:opacity-40")}>
        ➔
      </span>
    </button>
  );
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
  fullName,
  major,
  avatarUrl,
}: ProfileSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await uploadAvatarMutation.mutateAsync(file);
      setLocalPreview(null);
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      alert(error?.response?.data?.message || "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
      setLocalPreview(null);
    } finally {
      URL.revokeObjectURL(previewUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const displayAvatarUrl = localPreview || avatarUrl;

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3 pt-1">
        <ProfileAvatar name={fullName} avatarUrl={displayAvatarUrl} onClick={handleAvatarClick} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-center space-y-1.5 mt-1">
          <p className="text-base font-semibold text-[#1A1A2E] leading-tight tracking-normal">{fullName}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF8F5] border border-[#0D9488]/20 text-[#0D9488]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            <span className="text-xs font-medium">{major}</span>
          </div>
        </div>
      </div>

      <hr className="border-t border-[#EAEAF4]" />

      {/* Tab Navigation */}
      <nav aria-label="Profile sections" className="flex flex-col gap-1.5">
        {PROFILE_TABS.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id as ProfileTab}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id as ProfileTab)}
          />
        ))}
      </nav>

      <hr className="border-t border-[#EAEAF4]" />

      {/* Quick Status Box */}
      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] flex items-center justify-between text-xs text-[#64647A]">
        <span className="font-normal">Trạng thái đồng bộ</span>
        <span className="font-medium text-[#10B981] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
          Real-time
        </span>
      </div>
    </div>
  );
}
