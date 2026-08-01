"use client";

import { useState } from "react";
import { ProfileSidebar } from "./ProfileSidebar";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { AccountActionsRow } from "./AccountActionsRow";
import { SecurityPanel, SettingsPanel } from "./OtherPanels";
import { USER_PROFILE } from "./constants";
import type { ProfileTab } from "./types";

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar() {
  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <input
        type="search"
        id="profile-search"
        placeholder="Search settings…"
        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-[#111827] placeholder-gray-400 bg-white border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200 shadow-2xs"
      />
    </div>
  );
}

// ─── Panel renderer ───────────────────────────────────────────────────────────

function ActivePanel({
  tab,
  profile,
}: {
  tab: ProfileTab;
  profile: typeof USER_PROFILE;
}) {
  if (tab === "security") return <SecurityPanel />;
  if (tab === "settings") return <SettingsPanel />;
  return (
    <PersonalInfoPanel
      fullName={profile.fullName}
      email={profile.email}
      phone={profile.phone}
      bio={profile.bio}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileContainer() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F4F4F8] px-6 lg:px-10 py-8 gap-8">
      {/* Page header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] leading-tight tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-[#6B7280] font-medium mt-1">
            Manage your personal information and account security preferences.
          </p>
        </div>
        <SearchBar />
      </div>

      {/* Main grid: left sidebar card + right content card */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-20">
        {/* ── Left card (profile sidebar) ─────────────────────────────────── */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-2xs p-5 h-full">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              fullName={USER_PROFILE.fullName}
              major={USER_PROFILE.major}
            />
          </div>
        </div>

        {/* ── Right column ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/* Content panel */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-2xs p-6 flex-1">
            <ActivePanel tab={activeTab} profile={USER_PROFILE} />
          </div>

          {/* Account action cards — only shown on personal info tab */}
          {activeTab === "personal-info" && <AccountActionsRow />}
        </div>
      </div>
    </div>
  );
}
