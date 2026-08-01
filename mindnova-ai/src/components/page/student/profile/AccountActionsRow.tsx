"use client";

import { MonitorIcon, TrashIcon } from "./icons";

// ─── ActiveSessionsCard ────────────────────────────────────────────────────────

function ActiveSessionsCard() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] shrink-0">
          <MonitorIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-[#111827] leading-snug">
            Active Sessions
          </p>
          <p className="text-xs text-[#6B7280] font-medium mt-0.5">
            2 active devices found.
          </p>
          <button
            type="button"
            className="mt-2 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] underline underline-offset-2 transition-colors duration-150 cursor-pointer"
          >
            Manage Devices
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DeactivateAccountCard ────────────────────────────────────────────────────

function DeactivateAccountCard() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-red-200 bg-red-50/40 p-5 flex flex-col gap-3 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 shrink-0">
          <TrashIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-[#111827] leading-snug">
            Deactivate Account
          </p>
          <p className="text-xs text-[#6B7280] font-medium mt-0.5">
            This action cannot be undone.
          </p>
          <button
            type="button"
            className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 underline underline-offset-2 transition-colors duration-150 cursor-pointer"
          >
            Start Process
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AccountActionsRow() {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <ActiveSessionsCard />
      <DeactivateAccountCard />
    </div>
  );
}
