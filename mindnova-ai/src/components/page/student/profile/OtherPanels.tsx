"use client";

import { useState } from "react";
import { usePasswordChange } from "@/src/hooks/usePasswordChange";

// ─── Password Strength Indicator ──────────────────────────────────────────────

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

const STRENGTH_CONFIG: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  empty: { label: "", color: "bg-[#E0E0E8]", bars: 0 },
  weak:  { label: "Weak",   color: "bg-red-500",    bars: 1 },
  fair:  { label: "Fair",   color: "bg-amber-500",  bars: 2 },
  good:  { label: "Good",   color: "bg-blue-500",   bars: 3 },
  strong:{ label: "Strong", color: "bg-emerald-500",bars: 4 },
};

function PasswordStrengthMeter({ level }: { level: StrengthLevel }) {
  const config = STRENGTH_CONFIG[level];
  if (level === "empty") return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              bar <= config.bars ? config.color : "bg-[#E0E0E8]"
            }`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-bold ${
        level === "weak" ? "text-red-500" :
        level === "fair" ? "text-amber-500" :
        level === "good" ? "text-blue-500" :
        "text-emerald-500"
      }`}>
        {config.label}
      </span>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${met ? "text-emerald-600" : "text-[#9090B0]"}`}>
      <svg className={`w-3 h-3 shrink-0 ${met ? "text-emerald-500" : "text-[#C0C0D0]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {met
          ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
          : <circle cx="12" cy="12" r="10"/>
        }
      </svg>
      {label}
    </li>
  );
}

// ─── SecurityPanel ────────────────────────────────────────────────────────────
// Logic extracted to usePasswordChange hook. This component is purely presentational.

export function SecurityPanel() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    currentPw,
    newPw,
    confirmPw,
    strengthLevel,
    requirements,
    mismatchError,
    successMessage,
    canSubmit,
    isSubmitting,
    setCurrentPw,
    setNewPw,
    setConfirmPw,
    handleSubmit,
  } = usePasswordChange();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">Security</h2>
        <p className="text-sm text-[#84849A] mt-0.5">
          Manage your password. Changing it will log out all other active sessions.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        {/* Current Password */}
        <div>
          <label htmlFor="current-pw" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-pw"
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 placeholder-[#B0B0C8] transition-all"
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 inset-y-0 text-[#A0A0C0] hover:text-[#6B6BFF] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showCurrent
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-pw" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 placeholder-[#B0B0C8] transition-all"
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 inset-y-0 text-[#A0A0C0] hover:text-[#6B6BFF] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showNew
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </button>
          </div>
          {/* Strength meter */}
          <PasswordStrengthMeter level={strengthLevel} />
          {/* Requirements */}
          {newPw.length > 0 && (
            <ul className="mt-2.5 space-y-1 pl-0.5">
              {requirements.map((req) => (
                <RequirementItem key={req.label} met={req.met} label={req.label} />
              ))}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-pw" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
            Confirm New Password
          </label>
          <input
            id="confirm-pw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] bg-white border transition-all focus:outline-none focus:ring-4 placeholder-[#B0B0C8] ${
              mismatchError
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-[#6B6BFF]/10"
            }`}
          />
          {mismatchError && (
            <p className="mt-1.5 text-xs font-medium text-red-500">{mismatchError}</p>
          )}
        </div>

        {/* Session-invalidation notice */}
        <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Security notice:</span> Changing your password will automatically invalidate all active sessions on other devices.
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="text-sm font-semibold text-emerald-700">{successMessage}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SettingsPanel ────────────────────────────────────────────────────────────

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(false);

  const toggles = [
    { id: "notif", label: "Email Notifications", description: "Receive course updates and reminders.", value: notifications, set: setNotifications },
    { id: "weekly", label: "Weekly Report", description: "Get a weekly digest of your progress.", value: weeklyReport, set: setWeeklyReport },
    { id: "ai-sug", label: "AI Suggestions", description: "Personalized AI study suggestions.", value: aiSuggestions, set: setAiSuggestions },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">Settings</h2>
        <p className="text-sm text-[#84849A] mt-0.5">
          Customize your learning experience and notification preferences.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {toggles.map(({ id, label, description, value, set }) => (
          <div key={id} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#EAEAF4] bg-white">
            <div>
              <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
              <p className="text-xs text-[#84849A] mt-0.5">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={() => set(!value)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40 shrink-0 ${value ? "bg-[#6B6BFF]" : "bg-[#D0D0E0]"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
