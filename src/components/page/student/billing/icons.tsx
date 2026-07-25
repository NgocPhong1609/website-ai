// ─── Billing Icons ────────────────────────────────────────────────────────────

const SVG = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TrashIcon({ size = 15 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function FilterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ShieldIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function RefreshIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG} width={size} height={size}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export function ChevronDownSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
