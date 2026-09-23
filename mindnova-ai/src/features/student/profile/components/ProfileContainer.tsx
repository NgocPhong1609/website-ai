"use client";

import { useState } from "react";
import { ProfileSidebar } from "./ProfileSidebar";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { SecurityPanel, SettingsPanel } from "./OtherPanels";
import { useGetProfile } from "../api";
import { Shield, Sparkles } from "lucide-react";
import type { ProfileTab, UserProfile } from "../types";
import { Loader } from "@/src/shared/components/ui/Loader";

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
  const { data: profile, isLoading, isError, error, refetch } = useGetProfile();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-6 animate-pulse">
        {/* Hero Banner Skeleton */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-full max-w-md bg-slate-200 rounded mt-2"></div>
              <div className="h-4 w-3/4 max-w-sm bg-slate-200 rounded"></div>
            </div>
            <div className="shrink-0 flex items-center gap-5 bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-[280px]">
              <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-40 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Layout Skeleton */}
        <div className="flex flex-col lg:flex-row items-start gap-6 flex-1 min-h-0">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-full bg-slate-200 rounded"></div>
                <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-px bg-slate-200 w-full"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>

          {/* Active Panel Skeleton */}
          <div className="flex-1 min-w-0 w-full rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-full max-w-md bg-slate-200 rounded"></div>
            </div>
            <div className="h-px bg-slate-200 w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-24 w-full bg-slate-200 rounded-xl"></div>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Không thể tải thông tin</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          {error instanceof Error && error.message.includes("401")
            ? "Phiên đăng nhập đã hết hạn. Đang chuyển hướng..."
            : "Vui lòng kiểm tra kết nối mạng và thử lại."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-1 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-6">
      
      {/* ── Hero Banner ── */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Quản lý Tài khoản <span className="text-slate-500 font-normal">&amp; Bảo mật</span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              Cập nhật thông tin nhận dạng cá nhân, thiết lập danh tính, và tùy chỉnh cấu hình bảo mật. Dữ liệu của bạn được AI đồng bộ an toàn.
            </p>
          </div>

          {/* Mastery/Completion Card */}
          <div className="shrink-0 flex items-center gap-5 bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-[280px]">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - profile.completionPercent / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
                {profile.completionPercent}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Hoàn thiện hồ sơ</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Cấp độ A+
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hãy hoàn tất các mục còn thiếu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Layout: Sidebar + Panel ── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 flex-1 min-h-0">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            fullName={profile.fullName}
            major={profile.major}
            avatarUrl={profile.avatarUrl}
          />
        </div>

        {/* Active Panel Content */}
        <div className="flex-1 min-w-0 w-full rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <ActivePanel tab={activeTab} profile={profile} />
        </div>
      </div>
    </div>
  );
}
