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
 <></>
 );
}

function JavaScriptIcon() {
 return (
 <></>
 );
}

function TypeScriptIcon() {
 return (
 <></>
 );
}

function ReactIcon() {
 return (
 <></>
 );
}

function NextJsIcon() {
 return (
 <></>
 );
}

function NodeJsIcon() {
 return (
 <></>
 );
}

function DatabaseIcon() {
 return (
 <></>
 );
}

function ApiIcon() {
 return (
 <></>
 );
}

function AuthenticationIcon() {
 return (
 <></>
 );
}

function UiUxIcon() {
 return (
 <></>
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
