"use client";

import { MonitorIcon, TrashIcon } from "./icons";

// ─── ActiveSessionsCard ────────────────────────────────────────────────────────

function ActiveSessionsCard() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-[#EAEAF4] bg-white p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#6B6BFF] shrink-0">
          <MonitorIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1A1A2E] leading-snug">Active Sessions</p>
          <p className="text-xs text-[#84849A] mt-0.5">2 active devices found.</p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-[#6B6BFF] hover:text-[#4648D4] underline underline-offset-2 transition-colors duration-150"
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
    <div className="flex-1 min-w-0 rounded-2xl border border-red-100 bg-red-50/60 p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-500 shrink-0">
          <TrashIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1A1A2E] leading-snug">Deactivate Account</p>
          <p className="text-xs text-[#84849A] mt-0.5">This action cannot be undone.</p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors duration-150"
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
    <div className="flex flex-col sm:flex-row gap-4">
      <ActiveSessionsCard />
      <DeactivateAccountCard />
    </div>
  );
}
