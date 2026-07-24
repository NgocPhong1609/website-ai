import type { TopicIconKey } from "@/src/components/page/student/onboarding/types";

// ─── Icon Components ──────────────────────────────────────────────────────────
// Each icon is a pure presentational component with aria-hidden for accessibility.

const SVG_PROPS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
} as const;

function HtmlCssIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="5 7 10 12 5 17" />
      <line x1="13" y1="17" x2="19" y2="17" />
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

function NextJsIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polygon points="12 2 22 19 2 19" />
    </svg>
  );
}

function NodeJsIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg {...SVG_PROPS}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ApiIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 2v20M2 12h20" />
    </svg>
  );
}

function AuthenticationIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UiUxIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

// ─── Icon Registry ────────────────────────────────────────────────────────────
// To add a new topic icon: 1) create the component above, 2) add it here.

export const TOPIC_ICON_MAP: Record<TopicIconKey, React.FC> = {
  "html-css": HtmlCssIcon,
  javascript: JavaScriptIcon,
  typescript: TypeScriptIcon,
  react: ReactIcon,
  nextjs: NextJsIcon,
  nodejs: NodeJsIcon,
  database: DatabaseIcon,
  api: ApiIcon,
  authentication: AuthenticationIcon,
  "ui-ux": UiUxIcon,
};
