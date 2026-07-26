"use client";

import { SparkleIcon } from "./icons";
import { useProfileForm } from "@/src/hooks/useProfileForm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfoPanelProps {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
      {children}
    </label>
  );
}

interface FormInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
}

function FormInput({ id, value, onChange, type = "text", placeholder, hasError, disabled }: FormInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] bg-white border transition-all duration-200 focus:outline-none focus:ring-4 placeholder-[#B0B0C8] disabled:opacity-60 disabled:cursor-not-allowed ${
        hasError
          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
          : "border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-[#6B6BFF]/10"
      }`}
    />
  );
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

function AiInsightsCard({ completionPercent }: { completionPercent: number }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#6B6BFF]/20 bg-gradient-to-br from-[#F5F5FF] to-[#EDEDFF] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#6B6BFF]/15 text-[#6B6BFF]">
          <SparkleIcon size={12} />
        </span>
        <p className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest">AI Insights</p>
      </div>
      <p className="text-sm text-[#4A4A6A] leading-relaxed">
        Your profile is{" "}
        <span className="font-bold text-[#4648D4]">{completionPercent}%</span>{" "}
        complete. Adding a short bio helps our AI personalize your career suggestions.
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-[#D8D8F8]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] transition-all duration-700"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
// 'use client' pushed to leaf — logic in useProfileForm hook (checklist rule #2).

export function PersonalInfoPanel({ fullName: initName, email, phone: initPhone, bio: initBio }: PersonalInfoPanelProps) {
  const {
    fullName,
    phone,
    bio,
    errors,
    isDirty,
    isSaved,
    setFullName,
    setPhone,
    setBio,
    handleSave,
    handleDiscard,
  } = useProfileForm({ fullName: initName, phone: initPhone, bio: initBio });

  const completionPercent = Math.min(
    100,
    [fullName.trim(), email.trim(), phone.trim(), bio.trim()].filter(Boolean).length * 25
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Panel header */}
      <div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">Personal Information</h2>
        <p className="text-sm text-[#84849A] mt-0.5">
          Update your public profile details and contact information.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="profile-fullname">Full Name</FormLabel>
            <FormInput
              id="profile-fullname"
              value={fullName}
              onChange={setFullName}
              placeholder="Your full name"
              hasError={!!errors.fullName}
            />
            <FieldError message={errors.fullName} />
          </div>
          <div>
            <FormLabel htmlFor="profile-email">Email Address</FormLabel>
            <FormInput
              id="profile-email"
              value={email}
              onChange={() => {}}
              type="email"
              placeholder="your@email.com"
              disabled
            />
            <p className="mt-1.5 text-xs text-[#A0A0C0]">Email cannot be changed here.</p>
          </div>
        </div>

        {/* Phone */}
        <div>
          <FormLabel htmlFor="profile-phone">Phone Number</FormLabel>
          <FormInput
            id="profile-phone"
            value={phone}
            onChange={setPhone}
            placeholder="+84 90 123 4567"
            hasError={!!errors.phone}
          />
          <FieldError message={errors.phone} />
          {!errors.phone && (
            <p className="mt-1.5 text-xs text-[#A0A0C0]">
              Digits, +, -, and spaces only. XSS characters are blocked.
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FormLabel htmlFor="profile-bio">Bio</FormLabel>
            <span className={`text-xs font-medium ${bio.length > 450 ? "text-amber-500" : "text-[#A0A0C0]"}`}>
              {bio.length}/500
            </span>
          </div>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell us a little about yourself…"
            className={`w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white border transition-all duration-200 focus:outline-none focus:ring-4 placeholder-[#B0B0C8] resize-none leading-relaxed ${
              errors.bio
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-[#6B6BFF]/10"
            }`}
          />
          <FieldError message={errors.bio} />
        </div>

        {/* Save success state */}
        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm font-semibold text-emerald-700">Profile saved successfully.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF]/30 bg-white hover:bg-[#F5F5FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <AiInsightsCard completionPercent={completionPercent} />
    </div>
  );
}
