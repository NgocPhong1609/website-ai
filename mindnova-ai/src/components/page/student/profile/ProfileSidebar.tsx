"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import type { ProfileTab } from "./types";
import { PersonalInfoIcon, SecurityIcon, SettingsIcon } from "./icons";
import { useAvatarUpload } from "@/src/hooks/useAvatarUpload";

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
}

function ProfileAvatar({ name }: { name: string }) {
  const {
    previewUrl,
    rawImageUrl,
    uploadError,
    isUploading,
    isDragging,
    isCropperOpen,
    zoomLevel,
    fileInputRef,
    triggerFilePicker,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setZoomLevel,
    handleApplyCrop,
    handleCancelCrop,
  } = useAvatarUpload();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <div
        className="relative mx-auto w-full max-w-[220px] flex flex-col items-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input — JPG/PNG only */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload profile avatar"
        />

        {/* Avatar circle with drag drop visual state */}
        <div
          onClick={triggerFilePicker}
          className={`group relative w-28 h-28 rounded-full p-[4px] cursor-pointer transition-all duration-300 shadow-[0_8px_30px_rgba(107,107,255,0.35)] hover:scale-105 ${
            isDragging
              ? "bg-gradient-to-r from-emerald-400 to-cyan-400 scale-110 ring-4 ring-emerald-500/30"
              : "bg-gradient-to-br from-[#6B6BFF] to-[#4648D4]"
          }`}
          title="Click or drag & drop image to upload avatar (JPG/PNG, max 5MB)"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#2D2D5E] flex items-center justify-center overflow-hidden relative">
            {isUploading ? (
              <div className="w-7 h-7 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : previewUrl ? (
              <Image src={previewUrl} alt={`${name} avatar`} width={112} height={112} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-white tracking-wider select-none">{initials}</span>
            )}

            {/* Hover overlay with Drag Instruction */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold p-1 text-center">
              <span>📷</span>
              <span>Drag & Drop or Click to Crop</span>
            </div>
          </div>
        </div>

        {/* Edit floating button */}
        <button
          type="button"
          onClick={triggerFilePicker}
          className="absolute bottom-1 right-8 w-8 h-8 rounded-full bg-[#6B6BFF] border-2 border-white flex items-center justify-center shadow-md hover:bg-[#4648D4] transition-transform hover:scale-110 z-10"
          title="Upload & Crop avatar (JPG/PNG, max 5MB)"
          aria-label="Change avatar"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Upload error banner */}
        {uploadError && (
          <div className="mt-3 w-full animate-fadeIn">
            <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl p-2 text-center leading-tight shadow-sm flex items-center justify-center gap-1.5">
              <span>⚠️</span>
              <span>{uploadError.message}</span>
            </p>
          </div>
        )}
      </div>

      {/* Built-In Image Cropper Modal */}
      {isCropperOpen && rawImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#131B2E] border border-gray-800 text-white p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>✂️ built-in Avatar Cropper</span>
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">Adjust zoom & center your professional presence</p>
              </div>
              <button
                type="button"
                onClick={handleCancelCrop}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cropper Viewport */}
            <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden bg-black border-4 border-[#6B6BFF] shadow-[0_0_35px_rgba(107,107,255,0.4)] flex items-center justify-center">
              {/* Grid Guides */}
              <div className="absolute inset-0 border border-white/20 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-white/15" />
                <div className="border-r border-white/15" />
                <div />
              </div>

              <div
                className="w-full h-full transition-transform duration-150 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <Image
                  src={rawImageUrl}
                  alt="Crop preview"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Zoom Slider Controls */}
            <div className="flex flex-col gap-2 px-4">
              <div className="flex justify-between text-xs font-mono font-bold text-indigo-200">
                <span>Zoom: {zoomLevel.toFixed(1)}x</span>
                <span>Max: 3.0x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-gray-700 accent-[#6B6BFF] cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCancelCrop}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#6B6BFF] to-[#22D3EE] shadow-[0_4px_16px_rgba(107,107,255,0.4)] hover:scale-105 transition-transform"
              >
                ✓ Apply Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
        "group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200",
        isActive
          ? "bg-[#6B6BFF] text-white shadow-[0_6px_20px_rgba(107,107,255,0.35)]"
          : "text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E]",
      )}
    >
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-xl transition-colors duration-200",
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
      <div className="flex flex-col items-center gap-2 pt-4 pb-2">
        <ProfileAvatar name={fullName} />
        <div className="mt-2 text-center">
          <p className="text-lg font-extrabold text-[#1A1A2E] leading-tight">{fullName}</p>
          <p className="text-xs font-semibold text-[#6B6BFF] mt-1 bg-[#6B6BFF]/10 px-3 py-1 rounded-full border border-[#6B6BFF]/20">
            {major}
          </p>
        </div>
        <p className="text-[11px] font-bold text-[#B0B0C8] text-center mt-1">
          JPG / PNG • Max 5MB • Drag & drop supported
        </p>
      </div>

      {/* Tab navigation (Centralized vertical tabs per Section 1.1) */}
      <nav aria-label="Profile sections" className="flex flex-col gap-1.5">
        <TabButton
          id="personal-info"
          label="Profile Details & Links"
          isActive={activeTab === "personal-info"}
          onClick={() => onTabChange("personal-info")}
        />
        <TabButton
          id="security"
          label="Password & Security"
          isActive={activeTab === "security"}
          onClick={() => onTabChange("security")}
        />
        <TabButton
          id="settings"
          label="Preferences & Alerts"
          isActive={activeTab === "settings"}
          onClick={() => onTabChange("settings")}
        />
      </nav>
    </div>
  );
}
