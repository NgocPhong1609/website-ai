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
  const { data: profile, isLoading, isError, error } = useGetProfile();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#C0392B] border-t-transparent rounded-full" /></div>;
  }

  if (isError || !profile) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#64647A]">
          {error instanceof Error && error.message.includes("401")
            ? "Phiên đăng nhập đã hết hạn. Đang chuyển hướng..."
            : "Không thể tải thông tin hồ sơ. Vui lòng thử lại sau."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
      
      {/* ─── Synchronized Universal Hero Banner matching /courses & /study-plan ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-[#FEFCF9] border border-[#E8E2D9] p-6 sm:p-7 transition-all duration-300 w-full">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#C0392B]/5 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#E8E2D9]/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D9] text-xs font-semibold text-[#8A8478] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#27AE60] absolute" />
              Hồ sơ Học viên • Xác thực hợp lệ
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3039] leading-tight font-[family-name:var(--font-playfair-display)]">
              Quản lý <span className="text-[#C0392B] font-bold">Tài khoản &amp; Bảo mật 🛡️</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#4A4F5C] leading-relaxed font-normal">
              Cập nhật thông tin nhận dạng cá nhân, thiết lập danh tính, và tùy chỉnh cấu hình bảo mật hệ thống. Dữ liệu của bạn được AI đồng bộ và bảo vệ định kỳ.
            </p>
          </div>

          {/* Universal Wide Mastery Card matching /study-plan & /courses */}
          <div className="group shrink-0 bg-white rounded-2xl p-5 border border-[#E8E2D9] flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#C0392B]/30 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#8A8478] group-hover:text-[#2C3039] transition-colors">Độ hoàn thiện hồ sơ ↗</span>
              <span className="text-[11px] font-bold text-[#27AE60] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full border border-[#27AE60]/20">
                Tốt nhất
              </span>
            </div>

            <div className="text-3xl font-bold text-[#2C3039] my-1 flex items-baseline justify-between gap-6">
              <div>
                <span className="text-[#C0392B]">{profile.completionPercent}%</span>
                <span className="text-xs font-medium text-[#8A8478] ml-1.5">hoàn tất</span>
              </div>
              <span className="text-xs font-semibold text-[#8A8478]">
                Cấp độ Bảo mật A+
              </span>
            </div>

            <div className="w-full h-2 bg-[#F5F0E8] rounded-full mt-2 overflow-hidden p-0.5 border border-[#E8E2D9]">
              <div
                className="h-full bg-[#C0392B] rounded-full transition-all duration-1000"
                style={{ width: `${profile.completionPercent}%` }}
              />
            </div>

            <p className="text-xs font-semibold text-[#8A8478] mt-3 flex items-center justify-between gap-4">
              <span>🔥 Hồ sơ đang được xác minh đầy đủ!</span>
              <span className="text-[#2C3039] font-bold cursor-pointer hover:underline">Cập nhật ngay ➔</span>
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
              avatarUrl={profile.avatarUrl}
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
