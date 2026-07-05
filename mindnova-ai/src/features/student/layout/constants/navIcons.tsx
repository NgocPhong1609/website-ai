import type { NavIconKey } from "@/src/features/student/layout/types";

// ─── Shared SVG props ─────────────────────────────────────────────────────────

const SVG_PROPS = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

// ─── Icon Components ──────────────────────────────────────────────────────────
// To add a new icon: 1) create the component, 2) register it in NAV_ICON_MAP.

function DashboardIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function CoursesIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function StudyPlanIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 0 .5-4H1" />
      <polyline points="1 3 1 7 5 7" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

// ─── Icon Registry ────────────────────────────────────────────────────────────

export const NAV_ICON_MAP: Record<NavIconKey, React.FC> = {
  dashboard: DashboardIcon,
  courses: CoursesIcon,
  "study-plan": StudyPlanIcon,
  practice: PracticeIcon,
  progress: ProgressIcon,
  history: HistoryIcon,
  profile: ProfileIcon,
  billing: BillingIcon,
};
