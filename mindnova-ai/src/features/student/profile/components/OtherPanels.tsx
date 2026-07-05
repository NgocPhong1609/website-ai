"use client";

import { useState } from "react";

// ─── Placeholder panels ────────────────────────────────────────────────────────

export function SecurityPanel() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const canSave = currentPw.length > 0 && newPw.length >= 8 && newPw === confirmPw;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">Security</h2>
        <p className="text-sm text-[#84849A] mt-0.5">
          Manage your password and account security preferences.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        {[
          { id: "current-pw", label: "Current Password", value: currentPw, set: setCurrentPw },
          { id: "new-pw",     label: "New Password",     value: newPw,     set: setNewPw     },
          { id: "confirm-pw", label: "Confirm Password", value: confirmPw, set: setConfirmPw },
        ].map(({ id, label, value, set }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
              {label}
            </label>
            <input
              id={id}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 placeholder-[#B0B0C8] transition-all duration-200"
            />
          </div>
        ))}

        {newPw.length > 0 && newPw !== confirmPw && (
          <p className="text-xs text-red-500">Passwords do not match.</p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!canSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(false);

  const toggles = [
    { id: "notif",    label: "Email Notifications", description: "Receive course updates and reminders.", value: notifications, set: setNotifications },
    { id: "weekly",   label: "Weekly Report",        description: "Get a weekly digest of your progress.",  value: weeklyReport,   set: setWeeklyReport   },
    { id: "ai-sug",   label: "AI Suggestions",       description: "Personalized AI study suggestions.",      value: aiSuggestions,  set: setAiSuggestions  },
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
          <div
            key={id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#EAEAF4] bg-white"
          >
            <div>
              <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
              <p className="text-xs text-[#84849A] mt-0.5">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={() => set(!value)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40 shrink-0 ${
                value ? "bg-[#6B6BFF]" : "bg-[#D0D0E0]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
