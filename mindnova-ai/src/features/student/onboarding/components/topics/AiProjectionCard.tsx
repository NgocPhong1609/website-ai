import { twMerge } from "tailwind-merge";
import { COMPLEXITY_CONFIG } from "@/src/features/student/onboarding/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiProjectionCardProps {
  selectedCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_INSIGHT_PLACEHOLDER =
  "Select topics above to see your personalized complexity projection.";

const AI_INSIGHT_ACTIVE =
  "Selecting more topics allows the AI to find deeper cross-disciplinary connections.";

/** Decorative neural network nodes rendered in the visualization banner. */
const NEURAL_NODES = [
  { top: "28%", left: "50%", size: 7, glow: "#4cd7f6" },
  { top: "55%", left: "28%", size: 4, glow: "#6B6BFF" },
  { top: "42%", left: "72%", size: 5, glow: "#4cd7f6" },
  { top: "72%", left: "56%", size: 3, glow: "#4cd7f6" },
  { top: "18%", left: "34%", size: 3, glow: "#6B6BFF" },
  { top: "66%", left: "18%", size: 2, glow: "#4cd7f6" },
  { top: "22%", left: "78%", size: 2, glow: "#6B6BFF" },
  { top: "48%", left: "14%", size: 2, glow: "#4cd7f6" },
  { top: "80%", left: "36%", size: 2, glow: "#6B6BFF" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getComplexity(selectedCount: number) {
  return (
    COMPLEXITY_CONFIG.find((cfg) => selectedCount <= cfg.maxTopics) ??
    COMPLEXITY_CONFIG[COMPLEXITY_CONFIG.length - 1]
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComplexityIcon() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6B6BFF]/20 to-[#4648D4]/10 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(107,107,255,0.15)]">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B6BFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    </div>
  );
}

interface ComplexityMeterProps {
  label: string;
  percent: number;
  level: number;
}

function ComplexityMeter({ label, percent, level }: ComplexityMeterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5">
        <ComplexityIcon />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#131B2E] truncate">
            Skill Complexity
          </p>
          <p className="text-[11px] text-[#84849A] truncate">{label}</p>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={twMerge(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              i < level
                ? "bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6]"
                : "bg-[#E8E8F0]",
            )}
          />
        ))}
      </div>

      {/* Accessible progress for screen readers */}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Skill complexity: ${label}`}
        className="sr-only"
      />
    </div>
  );
}

function NeuralNetworkVisualization() {
  return (
    <div
      className="relative w-full h-28 rounded-xl overflow-hidden bg-[#060d2b]"
      aria-hidden="true"
    >
      {/* Layered glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,215,246,0.22)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_65%,rgba(70,72,212,0.32)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,rgba(76,215,246,0.12)_0%,transparent_50%)]" />

      {/* Neural nodes */}
      {NEURAL_NODES.map((node, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: node.top,
            left: node.left,
            width: node.size,
            height: node.size,
            background: node.glow,
            boxShadow: `0 0 ${node.size * 4}px ${node.glow}`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Label */}
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <span className="text-[9px] font-mono tracking-[0.2em] text-[#4cd7f6]/50 uppercase">
          AI Neural Map
        </span>
      </div>
    </div>
  );
}

/** Estimated time chip shown beneath complexity */
const TIME_ESTIMATES: Record<number, string> = {
  0: "—",
  1: "2–4 weeks",
  2: "1–2 months",
  3: "2–3 months",
  4: "3–5 months",
  5: "5–8 months",
};

function TimeEstimate({ level }: { level: number }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-[#ADADC0]">Est. time to proficiency</span>
      <span className="font-semibold text-[#4648D4]">
        {TIME_ESTIMATES[level] ?? "—"}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AiProjectionCard({ selectedCount }: AiProjectionCardProps) {
  const complexity = getComplexity(selectedCount);
  const hasSelection = selectedCount > 0;

  return (
    <div className="w-[220px] shrink-0 flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_2px_6px_rgba(107,107,255,0.4)]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-[#131B2E]">AI Projection</h2>
      </div>

      {/* Complexity card */}
      <div className="bg-white border border-[#E8E8F0] rounded-2xl p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(107,107,255,0.05)]">
        <ComplexityMeter
          label={complexity.label}
          percent={complexity.percent}
          level={complexity.level}
        />

        {hasSelection && (
          <>
            <div className="h-px bg-[#F0F0F7]" />
            <TimeEstimate level={complexity.level} />
          </>
        )}

        {/* AI insight */}
        <div
          className={twMerge(
            "flex gap-2 p-2.5 rounded-xl transition-all duration-300",
            hasSelection
              ? "bg-gradient-to-br from-[#6B6BFF]/6 to-[#4648D4]/4 border border-[#6B6BFF]/12"
              : "bg-[#FAFAFA] border border-[#F0F0F7]",
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={hasSelection ? "#6B6BFF" : "#ADADC0"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p
            className={twMerge(
              "text-[10.5px] leading-relaxed transition-colors duration-300",
              hasSelection ? "text-[#4648D4]" : "text-[#ADADC0]",
            )}
          >
            {hasSelection ? AI_INSIGHT_ACTIVE : AI_INSIGHT_PLACEHOLDER}
          </p>
        </div>
      </div>

      {/* Neural network visualization */}
      <NeuralNetworkVisualization />
    </div>
  );
}
