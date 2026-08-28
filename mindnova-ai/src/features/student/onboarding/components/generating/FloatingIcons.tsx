// ─── Individual Decorative Icons ────────────────────────────────────────────

function CurlyBracesIcon() {
 return (
 <></>
 );
}

function AiHeadIcon() {
 return (
 <></>
 );
}

function NetworkIcon() {
 return (
 <></>
 );
}

function TerminalIcon() {
 return (
 <></>
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
