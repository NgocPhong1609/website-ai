"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";

import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ProfileTab } from "../types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";
import { PROFILE_TABS } from "../constants";
import { useUploadAvatar } from "../api";
import { ShieldCheck, Camera, Upload, CheckCircle2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

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
  isLoading?: boolean;
}

function ProfileAvatar({ name, avatarUrl, onClick, isLoading }: ProfileAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(-2)
    .join("");

  return (
    <div className="relative mx-auto w-24 h-24 group cursor-pointer" onClick={onClick}>
      <div className="w-full h-full rounded-[24px] bg-white border border-[#EAEAF4] shadow-sm p-1.5 transition-all duration-300 group-hover:shadow-md group-hover:border-[#3b82f6]/40 group-hover:-translate-y-1">
        <div className="w-full h-full rounded-2xl bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.querySelector("span")?.removeAttribute("style");
              }}
            />
          ) : (
            <span className="text-2xl font-semibold text-blue-600 select-none relative z-10">
              {initials || "AI"}
            </span>
          )}

          {isLoading ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 text-white">
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Đổi ảnh</span>
            </div>
          )}
        </div>
      </div>

      <div 
        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-sm z-30" 
        title="Tài khoản đã xác thực"
      >
        <ShieldCheck className="w-4 h-4" />
      </div>
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
      className={twMerge(
        "group relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer outline-none border",
        isActive
          ? "bg-[#eff6ff] text-[#1d4ed8] shadow-xs border-[#3b82f6]/20 font-semibold"
          : "bg-white text-[#64748b] border-transparent hover:bg-[#F8FAFC] hover:text-[#0f172a] hover:border-[#EAEAF4]"
      )}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={twMerge(
            "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 shrink-0",
            isActive
              ? "bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-md shadow-blue-500/20 scale-110"
              : "bg-[#F1F5F9] text-[#64748b] group-hover:bg-white group-hover:text-[#3b82f6] group-hover:shadow-sm"
          )}
        >
          <Icon />
        </span>
        <span className="truncate">{label}</span>
      </div>
      {isActive ? (
        <CheckCircle2 className="w-4 h-4 text-[#3b82f6] shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 text-[#94a3b8] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 shrink-0" />
      )}
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
    if (uploadAvatarMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh đại diện vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await uploadAvatarMutation.mutateAsync(file);
      setLocalPreview(null);
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      toast.error(getErrorMessage(error, "Không thể cập nhật ảnh đại diện. Vui lòng thử lại."));
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
    <div className="flex flex-col gap-6 bg-white rounded-[24px] border border-[#EAEAF4] p-5 sm:p-6 shadow-sm">
      
      {/* Avatar + Info */}
      <div className="flex flex-col items-center gap-4 text-center">
        <ProfileAvatar
          name={fullName}
          avatarUrl={displayAvatarUrl}
          onClick={handleAvatarClick}
          isLoading={uploadAvatarMutation.isPending}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="space-y-1 mt-1">
          <h2 className="text-lg font-semibold text-[#0f172a]">{fullName}</h2>
        </div>
      </div>

      <hr className="border-[#EAEAF4]" />

      {/* Tabs */}
      <nav className="flex flex-col gap-1.5">
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

    </div>
  );
}
