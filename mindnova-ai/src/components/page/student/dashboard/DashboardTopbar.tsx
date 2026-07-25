// ─── DashboardTopbar ─────────────────────────────────────────────────────────
// Top search + actions bar for the dashboard layout.

// ─── Icons ───────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardTopbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          placeholder="Search courses, topics, or AI help…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <BellIcon />
          {/* Unread dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 border-2 border-white" />
        </button>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <SettingsIcon />
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="User profile"
          className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] hover:shadow-[0_4px_14px_rgba(107,107,255,0.5)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
        >
          H
        </button>
      </div>
    </header>
  );
}
