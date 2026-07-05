// ─── Individual Decorative Icons ────────────────────────────────────────────

function CurlyBracesIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9B9BE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

function AiHeadIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6BD0CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7v2a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7z" />
      <path d="M12 13v-2M10 11h4" />
      <path d="M9 21v-2a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9B9BE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <circle cx="12" cy="14" r="2" />
      <line x1="12" y1="7" x2="12" y2="12" />
      <line x1="10.5" y1="15.5" x2="6.5" y2="17.5" />
      <line x1="13.5" y1="15.5" x2="17.5" y2="17.5" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9B9BE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

// ─── Icon Card Wrapper ────────────────────────────────────────────────────────

interface IconCardProps {
  children: React.ReactNode;
  className?: string;
}

function IconCard({ children, className = "" }: IconCardProps) {
  return (
    <div
      className={`w-16 h-16 rounded-2xl bg-white/60 border border-[#E2E2EA]/80 flex items-center justify-center shadow-sm backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Exported Groups ──────────────────────────────────────────────────────────

/** Left-side floating icons */
export function LeftFloatingIcons() {
  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-5" aria-hidden="true">
      <IconCard className="animate-float">
        <CurlyBracesIcon />
      </IconCard>
      <IconCard className="animate-float-delay">
        <AiHeadIcon />
      </IconCard>
    </div>
  );
}

/** Right-side floating icons */
export function RightFloatingIcons() {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-5" aria-hidden="true">
      <IconCard className="animate-float-delay">
        <NetworkIcon />
      </IconCard>
      <IconCard className="animate-float">
        <TerminalIcon />
      </IconCard>
    </div>
  );
}
