"use client";

import { useState } from "react";
import { ProfileSidebar } from "./ProfileSidebar";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { SecurityPanel, SettingsPanel } from "./OtherPanels";
import { useGetProfile } from "../api";
import { Shield, Flame, ArrowRight } from "lucide-react";
import type { ProfileTab, UserProfile } from "../types";

function ActivePanel({ tab, profile }: { tab: ProfileTab; profile: UserProfile }) {
  if (tab === "security") return <SecurityPanel />;
  if (tab === "settings") return <SettingsPanel />;
  return (
    <PersonalInfoPanel
      fullName={profile.fullName}
      email={profile.email}
      bio={profile.bio}
      completionPercent={profile.completionPercent}
    />
  );
}

export default function ProfileContainer() {
 const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");
 const { data: profile, isLoading, isError, error } = useGetProfile();

 if (isLoading) {
 return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
 }

 if (isError || !profile) {
 return (
 <div className="p-8 flex flex-col items-center justify-center gap-4">
 <p className="text-sm text-muted-foreground">
 {error instanceof Error && error.message.includes("401")
 ? "Phiên đăng nhập đã hết hạn. Đang chuyển hướng..."
 : "Không thể tải thông tin hồ sơ. Vui lòng thử lại sau."}
 </p>
 </div>
 );
 }

 return (
 <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-full flex flex-col gap-10">
 
 {/* ─── Minimalist Synchronized Universal Hero Banner ─── */}
 <section className="relative w-full pb-6 border-b border-border/40">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
 <div className="space-y-4 max-w-xl">
 <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
 Quản lý Tài khoản <span className="text-muted-foreground font-normal">&amp; Bảo mật</span>
 </h1>

 <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
 Cập nhật thông tin nhận dạng cá nhân, thiết lập danh tính, và tùy chỉnh cấu hình bảo mật. Dữ liệu của bạn được AI đồng bộ an toàn.
 </p>
 </div>

 {/* Universal Wide Mastery Card - Minimalist Version */}
 <div className="group shrink-0 flex flex-col justify-center min-w-[320px] sm:min-w-[340px]">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-sm font-medium text-muted-foreground">Độ hoàn thiện hồ sơ</span>
 <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
 Cấp độ Bảo mật A+
 </span>
 </div>

 <div className="text-3xl font-bold text-foreground my-1 flex items-baseline justify-start gap-2">
 <span>{profile.completionPercent}%</span>
 <span className="text-sm font-medium text-muted-foreground">hoàn tất</span>
 </div>

 <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
 <div
 className="h-full bg-primary rounded-full transition-all duration-1000"
 style={{ width: `${profile.completionPercent}%` }}
 />
 </div>
 </div>
 </div>
 </section>

 {/* Main workspace: Left sidebar card + Right content card */}
 <div className="flex flex-col lg:flex-row items-start gap-12 flex-1 min-h-0">
 {/* Left Column (Profile Sidebar) */}
 <div className="w-full lg:w-64 shrink-0 sticky top-24">
 <ProfileSidebar
 activeTab={activeTab}
 onTabChange={setActiveTab}
 fullName={profile.fullName}
 major={profile.major}
 avatarUrl={profile.avatarUrl}
 />
 </div>

 {/* Right Column (Active Panel) */}
 <div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
 <ActivePanel tab={activeTab} profile={profile} />
 </div>
 </div>
 </div>
 );
}
