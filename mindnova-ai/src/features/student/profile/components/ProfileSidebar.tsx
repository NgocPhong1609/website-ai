"use client";

import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ProfileTab } from "../types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";
import { PROFILE_TABS } from "../constants";
import { useUploadAvatar } from "../api";
import { writeStoredUser } from "@/src/shared/lib/userStorage";
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
 <div className="relative mx-auto w-28 h-28 group cursor-pointer" onClick={onClick}>
 {/* Soft elegant avatar sphere */}
 <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/80 to-primary p-[3px] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
 <div className="w-full h-full rounded-full bg-muted flex items-center justify-center relative overflow-hidden">
 {avatarUrl ? (
 <img
 src={avatarUrl}
 alt={name}
 className="h-full w-full object-cover rounded-full relative z-10"
 onError={(e) => {
 e.currentTarget.style.display = "none";
 e.currentTarget.parentElement?.querySelector("span")?.removeAttribute("style");
 }}
 />
 ) : (
 <span className="text-2xl sm:text-3xl font-bold text-primary select-none relative z-10">
 {initials || "NP"}
 </span>
 )}

 {/* Loading spinner overlay */}
 {isLoading ? (
 <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-30">
 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 </div>
 ) : (
 /* Hover Photo Upload Overlay */
 <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 text-white rounded-full">
 <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
 <circle cx="12" cy="13" r="4" />
 </svg>
 <span className="text-[10px] font-medium">Đổi ảnh</span>
 </div>
 )}
 </div>
 </div>

 {/* Verified Online badge */}
 <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-foreground border-[3px] border-card flex items-center justify-center shadow-sm z-30" title="Tài khoản đã được AI xác thực">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
 "group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-normal transition-all duration-200 cursor-pointer overflow-hidden outline-none",
 isActive
 ? "bg-primary/5 text-primary font-medium"
 : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
 )}
 >
 {/* Minimalist Active Left Indicator */}
 {isActive && (
 <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-md bg-primary" />
 )}

 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 shrink-0",
 isActive
 ? "text-primary"
 : "text-muted-foreground group-hover:text-foreground"
 )}
 >
 <Icon />
 </span>

 <span className="flex-1 text-left truncate">{label}</span>
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
 toast.error(error?.response?.data?.message || "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
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
 <div className="flex flex-col gap-8">
 {/* Avatar + Name */}
 <div className="flex flex-col items-center gap-4 pt-2">
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
 <div className="text-center space-y-1.5 mt-1">
 <p className="text-lg font-semibold text-foreground leading-tight tracking-normal">{fullName}</p>
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-bg/50 text-foreground">
 <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
 <span className="text-xs font-medium text-muted-foreground">{major}</span>
 </div>
 </div>
 </div>

 {/* Tab Navigation */}
 <nav aria-label="Profile sections" className="flex flex-col gap-1">
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

 {/* Quick Status Text Only */}
 <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
 <span className="font-normal">Đồng bộ dữ liệu</span>
 <span className="font-medium text-foreground flex items-center gap-1.5">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
 </span>
 Real-time
 </span>
 </div>
 </div>
 );
}
