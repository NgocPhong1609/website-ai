"use client";

import { useState } from "react";
import { SparkleIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfoPanelProps {
  fullName: string;
  email: string;
  bio: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-[#1A1A2E] mb-1.5"
    >
      {children}
    </label>
  );
}

function FormInput({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 placeholder-[#B0B0C8] transition-all duration-200"
    />
  );
}

function AiInsightsCard({ completionPercent }: { completionPercent: number }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#6B6BFF]/20 bg-gradient-to-br from-[#F5F5FF] to-[#EDEDFF] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#6B6BFF]/15 text-[#6B6BFF]">
          <SparkleIcon size={12} />
        </span>
        <p className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest">
          AI Insights
        </p>
      </div>
      <p className="text-sm text-[#4A4A6A] leading-relaxed">
        Your profile is{" "}
        <span className="font-bold text-[#4648D4]">{completionPercent}%</span>{" "}
        complete. Adding a short bio helps our AI personalize your career
        suggestions.
      </p>
      {/* Progress bar */}
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

export function PersonalInfoPanel({
  fullName: initialName,
  email: initialEmail,
  bio: initialBio,
}: PersonalInfoPanelProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [bio, setBio] = useState(initialBio);
  const [saved, setSaved] = useState(false);

  const isDirty =
    fullName !== initialName || email !== initialEmail || bio !== initialBio;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDiscard() {
    setFullName(initialName);
    setEmail(initialEmail);
    setBio(initialBio);
  }

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
            />
          </div>
          <div>
            <FormLabel htmlFor="profile-email">Email Address</FormLabel>
            <FormInput
              id="profile-email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <FormLabel htmlFor="profile-bio">Bio</FormLabel>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell us a little about yourself…"
            className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 placeholder-[#B0B0C8] transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

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
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <AiInsightsCard completionPercent={85} />
    </div>
  );
}
