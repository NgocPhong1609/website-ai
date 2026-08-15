"use client";

import { useState } from "react";
import { ProfileSidebar } from "./ProfileSidebar";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { SecurityPanel, SettingsPanel } from "./OtherPanels";
import { useGetProfile } from "../api";
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
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#4648D4] border-t-transparent rounded-full" /></div>;
  }

  if (!profile) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
      
      {/* ─── Synchronized Universal Hero Banner matching /courses & /study-plan ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)] w-full">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              Hồ sơ Học viên • Xác thực hợp lệ
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Quản lý <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent font-bold drop-shadow-2xs">Tài khoản &amp; Bảo mật 🛡️</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Cập nhật thông tin nhận dạng cá nhân, thiết lập danh tính, và tùy chỉnh cấu hình bảo mật hệ thống. Dữ liệu của bạn được AI đồng bộ và bảo vệ định kỳ.
            </p>
          </div>

          {/* Universal Wide Mastery Card matching /study-plan & /courses */}
          <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Độ hoàn thiện hồ sơ ↗</span>
              <span className="text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                Tốt nhất
              </span>
            </div>

            <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
              <div>
                <span className="text-[#4648D4]">{profile.completionPercent}%</span>
                <span className="text-xs font-medium text-[#9090B0] ml-1.5">hoàn tất</span>
              </div>
              <span className="text-xs font-semibold text-[#64647A]">
                Cấp độ Bảo mật A+
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:brightness-110"
                style={{ width: `${profile.completionPercent}%` }}
              />
            </div>

            <p className="text-xs font-semibold text-[#6B6BFF] mt-3 flex items-center justify-between gap-4">
              <span>🔥 Hồ sơ đang được xác minh đầy đủ!</span>
              <span className="text-[#4648D4] font-bold cursor-pointer hover:underline">Cập nhật ngay ➔</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main workspace: Left sidebar card + Right content card */}
      <div className="flex flex-col lg:flex-row items-start gap-8 flex-1 min-h-0">
        {/* Left Card (Profile Sidebar) */}
        <div className="w-full lg:w-80 shrink-0 sticky top-24">
          <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-5 transition-all duration-300 hover:shadow-sm">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              fullName={profile.fullName}
              major={profile.major}
            />
          </div>
        </div>

        {/* Right Column (Active Panel) */}
        <div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
          <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-6 sm:p-8 flex-1 transition-all duration-300 hover:shadow-sm">
            <ActivePanel tab={activeTab} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
