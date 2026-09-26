"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";

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
          {getErrorMessage(error, "Không thể tải thông tin cá nhân. Vui lòng thử lại.")}
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
      <section className="relative overflow-hidden rounded-[32px] bg-white border border-[#EAEAF4] p-8 sm:p-10 shadow-sm">
        {/* Subtle background glow/gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#eff6ff] to-[#f3e8ff] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0f172a] leading-tight flex items-center gap-3">
              <span className="bg-[#eff6ff] text-[#2563eb] p-2.5 rounded-xl shadow-xs border border-[#2563eb]/10">
                 <Sparkles size={28} />
              </span>
              Hồ sơ của bạn
            </h1>
            <p className="text-[15px] text-[#64748b] leading-relaxed font-medium">
              Cập nhật thông tin cá nhân, thiết lập danh tính và tùy chỉnh bảo mật. 
              Trải nghiệm học tập sẽ được cá nhân hóa hoàn toàn dựa trên hồ sơ của bạn.
            </p>
          </div>

          {/* Mastery/Completion Card */}
          <div className="shrink-0 flex items-center gap-5 bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#EAEAF4] shadow-sm min-w-[300px] transition-all hover:shadow-md hover:border-[#2563eb]/20 cursor-default">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#F1F5F9" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="28" fill="none"
                  stroke="url(#blue-gradient)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - profile.completionPercent / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#1d4ed8]">
                {profile.completionPercent}%
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#0f172a]">Mức độ hoàn thiện</span>
                <span className="text-[10px] font-medium text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-2 py-0.5 rounded-full shadow-sm">
                  Cấp độ A+
                </span>
              </div>
              <p className="text-xs font-medium text-[#64748b]">
                {profile.completionPercent === 100 ? "Tuyệt vời! Hồ sơ đã hoàn chỉnh." : "Hãy hoàn tất các mục còn thiếu."}
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
        <div className="flex-1 min-w-0 w-full rounded-[24px] bg-white border border-[#EAEAF4] p-8 sm:p-10 shadow-sm">
          <ActivePanel tab={activeTab} profile={profile} />
        </div>
      </div>
    </div>
  );
}
