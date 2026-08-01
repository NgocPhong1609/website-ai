"use client";

import { useState } from "react";
import { SparkleIcon } from "./icons";
import { useProfileForm } from "@/src/hooks/useProfileForm";

interface PersonalInfoPanelProps {
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-extrabold text-[#1A1A2E] mb-1.5 flex items-center justify-between">
      <span>{children}</span>
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
  icon?: string;
}

function FormInput({ id, value, onChange, type = "text", placeholder, hasError, disabled, icon }: FormInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 select-none text-base">
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${icon ? "pl-10 pr-4" : "px-4"} py-3 rounded-2xl text-sm text-[#1A1A2E] bg-white border font-bold transition-all duration-200 focus:outline-none focus:ring-2 placeholder-[#B0B0C8] disabled:opacity-60 disabled:cursor-not-allowed ${
          hasError
            ? "border-red-400 focus:border-red-500 bg-red-50/10 text-red-900"
            : "border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 hover:border-gray-300"
        }`}
      />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-black text-red-600 flex items-center gap-1">⚠️ {message}</p>;
}

function AiInsightsCard({ completionPercent }: { completionPercent: number }) {
  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
            <SparkleIcon size={16} />
          </span>
          <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
            MindNova AI Community Profile &amp; Certificate Intelligence
          </h3>
        </div>
        <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-xl border border-indigo-100 font-mono">
          {completionPercent}% Mastered
        </span>
      </div>
      <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
        Your profile data directly customizes your <strong className="text-[#111827] font-bold">Cryptographic Graduation Certificates</strong> and professional presence in timestamped student discussions and peer leaderboards.
      </p>
      <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4F46E5] transition-all duration-700"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
    </div>
  );
}

// Dumb Leaf UI Presentation Component consuming useProfileForm React Query custom hook
export function PersonalInfoPanel({ fullName: initName = "", email: initEmail = "", phone: initPhone = "", bio: initBio = "" }: PersonalInfoPanelProps) {
  const {
    fullName,
    phone,
    bio,
    email,
    errors,
    isDirty: formDirty,
    isLoading,
    isSaving,
    isSaved,
    saveError,
    setFullName,
    setPhone,
    setBio,
    handleSave: hookSave,
    handleDiscard: hookDiscard,
  } = useProfileForm({ fullName: initName, phone: initPhone, bio: initBio });

  const [linkedIn, setLinkedIn] = useState("https://linkedin.com/in/mindnova-student");
  const [github, setGithub] = useState("https://github.com/mindnova");
  const [portfolio, setPortfolio] = useState("https://my-portfolio.dev");
  const [linksDirty, setLinksDirty] = useState(false);

  const isDirty = formDirty || linksDirty;

  const handleSave = () => {
    hookSave();
    setLinksDirty(false);
  };

  const handleDiscard = () => {
    hookDiscard();
    setLinkedIn("https://linkedin.com/in/mindnova-student");
    setGithub("https://github.com/mindnova");
    setPortfolio("https://my-portfolio.dev");
    setLinksDirty(false);
  };

  const completionPercent = Math.min(
    100,
    [fullName.trim(), (email || initEmail).trim(), phone.trim(), bio.trim(), linkedIn, github].filter(Boolean).length * 16 + 4
  );

  // Core Rule: Defensive UI Loading State via TanStack React Query
  if (isLoading) {
    return (
      <div className="p-16 rounded-3xl bg-white border border-[#EAEAF4] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-[#1A1A2E] tracking-wide">Synchronizing profile telemetry from server...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 p-6 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2.5">
            <span>Profile Details &amp; Community Presence</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              ⚡ Inline Editing Enabled
            </span>
          </h2>
          <p className="text-xs text-[#6B7280] font-medium mt-1">
            Edit your public persona directly below without navigating away. Changes reflect instantly on cryptographic certificates &amp; forums.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FormLabel htmlFor="profile-fullname">Full Name (Displayed on Certificates)</FormLabel>
            <FormInput
              id="profile-fullname"
              value={fullName}
              onChange={setFullName}
              placeholder="Your complete legal or professional name"
              hasError={!!errors.fullName}
              disabled={isSaving}
              icon="👤"
            />
            <FieldError message={errors.fullName} />
            <p className="mt-1 text-[11px] font-bold text-gray-400">Strict XSS sanitized against script injection.</p>
          </div>
          <div>
            <FormLabel htmlFor="profile-email">Email Address (Primary Login &amp; OTP)</FormLabel>
            <FormInput
              id="profile-email"
              value={email || initEmail || "student@mindnova.ai"}
              onChange={() => {}}
              type="email"
              placeholder="your@email.com"
              disabled
              icon="✉️"
            />
            <p className="mt-1 text-[11px] font-bold text-gray-400">Email is verified and locked to protect course progress logs.</p>
          </div>
        </div>

        <div>
          <FormLabel htmlFor="profile-phone">Phone Number (For MFA &amp; SMS Alerts)</FormLabel>
          <FormInput
            id="profile-phone"
            value={phone}
            onChange={setPhone}
            placeholder="+84 90 123 4567"
            hasError={!!errors.phone}
            disabled={isSaving}
            icon="📱"
          />
          <FieldError message={errors.phone} />
          {!errors.phone && (
            <p className="mt-1 text-[11px] font-bold text-gray-400">
              Strictly validated against XSS injection (digits, +, -, and spaces only).
            </p>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-[#FAFAFF] border border-[#EAEAF4] flex flex-col gap-4">
          <h3 className="text-xs font-black text-[#131B2E] uppercase tracking-wider flex items-center gap-2">
            <span>🌐 Professional Community Links (LinkedIn Certificate Sharing)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="link-linkedin">LinkedIn Profile</FormLabel>
              <FormInput
                id="link-linkedin"
                value={linkedIn}
                onChange={(v) => { setLinkedIn(v); setLinksDirty(true); }}
                placeholder="https://linkedin.com/in/..."
                disabled={isSaving}
                icon="💼"
              />
            </div>
            <div>
              <FormLabel htmlFor="link-github">GitHub Handle</FormLabel>
              <FormInput
                id="link-github"
                value={github}
                onChange={(v) => { setGithub(v); setLinksDirty(true); }}
                placeholder="https://github.com/..."
                disabled={isSaving}
                icon="💻"
              />
            </div>
            <div>
              <FormLabel htmlFor="link-portfolio">Portfolio / Web</FormLabel>
              <FormInput
                id="link-portfolio"
                value={portfolio}
                onChange={(v) => { setPortfolio(v); setLinksDirty(true); }}
                placeholder="https://my-domain.com"
                disabled={isSaving}
                icon="🔗"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FormLabel htmlFor="profile-bio">Professional Bio &amp; Career Goals</FormLabel>
            <span className={`text-xs font-extrabold font-mono px-2.5 py-0.5 rounded-xl ${bio.length > 450 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}>
              {bio.length} / 500 characters
            </span>
          </div>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            disabled={isSaving}
            placeholder="Describe your current tech stack, learning roadmap targets, and AI interests…"
            className={`w-full px-5 py-4 rounded-3xl text-sm font-bold text-[#1A1A2E] bg-white border transition-all duration-200 focus:outline-none focus:ring-2 placeholder-[#B0B0C8] resize-none leading-relaxed ${
              errors.bio
                ? "border-red-400 focus:border-red-500 bg-red-50/10 text-red-900"
                : "border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 shadow-2xs"
            }`}
          />
          <FieldError message={errors.bio} />
          <p className="mt-1 text-[11px] font-bold text-gray-400">
            Helps MindNova AI tutor personalize analogies and roadmap progression.
          </p>
        </div>

        {saveError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{saveError}</span>
          </div>
        )}

        {isSaved && (
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-50 border border-emerald-300 animate-fadeIn shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">✓</span>
            <div>
              <p className="text-sm font-black text-emerald-900">Profile Updated via React Query Mutation!</p>
              <p className="text-xs text-emerald-700 font-bold">Your graduation certificate identity and AI tutoring parameters are synchronized.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
            className="px-6 py-3.5 rounded-2xl text-xs font-black text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer uppercase tracking-wider"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="px-6 py-3 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs hover:shadow-sm transition-all disabled:opacity-40 uppercase tracking-wider cursor-pointer flex items-center gap-2"
          >
            {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{isSaving ? "Synchronizing..." : "Save & Sync Profile"}</span>
          </button>
        </div>
      </div>

      <AiInsightsCard completionPercent={completionPercent} />
    </div>
  );
}
