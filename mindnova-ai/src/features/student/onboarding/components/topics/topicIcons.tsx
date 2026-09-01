import type { TopicIconKey } from "@/src/features/student/onboarding/types";

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
      <path d="M4 3h16l-1.5 14L12 21l-6.5-4L4 3z" />
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M16 18l2-2v-4" />
      <path d="M8 8v8l3-1" />
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M4 6h16v12H4z" />
      <path d="M10 9v6" />
      <path d="M8 9h4" />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg {...SVG_PROPS}>
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function NextJsIcon() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 8v8l8-9" />
    </svg>
  );
}

function NodeJsIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" />
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
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
