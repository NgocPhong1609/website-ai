import { twMerge } from "tailwind-merge";
import { COMPLEXITY_CONFIG } from "@/src/features/student/onboarding/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiProjectionCardProps {
  selectedCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_INSIGHT_PLACEHOLDER =
  "Select topics above to see your AI complexity projection.";

const AI_INSIGHT_ACTIVE =
  "Cross-disciplinary connections detected — your learning path will be uniquely optimized.";

const NEURAL_NODES = [
  { top: "28%", left: "50%", size: 8, glow: "#4cd7f6" },
  { top: "55%", left: "25%", size: 5, glow: "#6B6BFF" },
  { top: "42%", left: "75%", size: 6, glow: "#4cd7f6" },
  { top: "74%", left: "58%", size: 4, glow: "#4cd7f6" },
  { top: "16%", left: "32%", size: 3, glow: "#6B6BFF" },
  { top: "68%", left: "16%", size: 3, glow: "#4cd7f6" },
  { top: "20%", left: "80%", size: 3, glow: "#6B6BFF" },
  { top: "50%", left: "12%", size: 2, glow: "#4cd7f6" },
  { top: "82%", left: "38%", size: 2, glow: "#6B6BFF" },
] as const;

const TIME_ESTIMATES: Record<number, string> = {
  0: "—",
  1: "2–4 weeks",
  2: "1–2 months",
  3: "2–3 months",
  4: "3–5 months",
  5: "5–8 months",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getComplexity(selectedCount: number) {
  return (
    COMPLEXITY_CONFIG.find((cfg) => selectedCount <= cfg.maxTopics) ??
    COMPLEXITY_CONFIG[COMPLEXITY_CONFIG.length - 1]
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NeuralNetworkVisualization({ active }: { active: boolean }) {
  return (
    <div
      className="relative w-full h-32 rounded-2xl overflow-hidden"
      aria-hidden="true"
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#060d2b]" />

      {/* Layered ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,215,246,0.25)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(70,72,212,0.35)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(76,215,246,0.15)_0%,transparent_50%)]" />

      {/* Active pulse overlay */}
      {active && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(107,107,255,0.18)_0%,transparent_70%)] animate-pulse" />
      )}

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
            opacity: active ? 1 : 0.4,
            transition: "opacity 0.5s ease",
          }}
        />
      ))}

      {/* Bottom label */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 gap-1">
        <span className="text-[9px] font-mono tracking-[0.18em] text-[#4cd7f6]/50 uppercase">
          AI Neural Map
        </span>
        {active && (
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-0.5 rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6]"
                style={{
                  flex: i === 0 ? 3 : i === 1 ? 2 : 1,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SegmentedBarProps {
  level: number;
  label: string;
}

function SegmentedBar({ level, label }: SegmentedBarProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#131B2E]">Skill Complexity</span>
        <span className="text-[#84849A]">{label}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={twMerge(
              "h-2 flex-1 rounded-full transition-all duration-500",
              i < level
                ? "bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6] shadow-[0_0_6px_rgba(107,107,255,0.4)]"
                : "bg-[#E8E8F0]",
            )}
          />
        ))}
      </div>
      <div
        role="progressbar"
        aria-valuenow={level * 20}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Skill complexity: ${label}`}
        className="sr-only"
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AiProjectionCard({ selectedCount }: AiProjectionCardProps) {
  const complexity = getComplexity(selectedCount);
  const hasSelection = selectedCount > 0;

  return (
    <div className="w-[240px] shrink-0 flex flex-col gap-3">
      {/* Header label */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_2px_8px_rgba(107,107,255,0.4)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-[#131B2E]">AI Projection</h2>
      </div>

      {/* Main card */}
      <div className="bg-white border border-[#E8E8F0] rounded-2xl p-4 space-y-3 shadow-[0_2px_12px_rgba(107,107,255,0.06)]">
        <SegmentedBar level={complexity.level} label={complexity.label} />

        {hasSelection && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-[#E8E8F0] to-transparent" />
            {/* Time estimate */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#ADADC0]">Est. time to proficiency</span>
              <span className="text-[11px] font-bold text-[#4648D4] bg-[#6B6BFF]/8 px-2 py-0.5 rounded-full">
                {TIME_ESTIMATES[complexity.level] ?? "—"}
              </span>
            </div>
          </>
        )}

        {/* Topics count */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-[#F8F8FF] to-[#F0F0FA] border border-[#EAEAF5]">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6B6BFF]/20 to-[#4648D4]/10 flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B6BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <p className={twMerge(
            "text-[10.5px] leading-relaxed transition-colors duration-300",
            hasSelection ? "text-[#4648D4]" : "text-[#ADADC0]",
          )}>
            {hasSelection ? AI_INSIGHT_ACTIVE : AI_INSIGHT_PLACEHOLDER}
          </p>
        </div>
      </div>

      {/* Neural visualization */}
      <NeuralNetworkVisualization active={hasSelection} />

      {/* Selection count pill */}
      <div className={twMerge(
        "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-300",
        hasSelection
          ? "bg-[#6B6BFF]/8 text-[#4648D4] border border-[#6B6BFF]/15"
          : "bg-[#F5F5F8] text-[#ADADC0] border border-[#EDEDF2]",
      )}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        {selectedCount > 0 ? `${selectedCount} topic${selectedCount > 1 ? "s" : ""} selected` : "No topics yet"}
      </div>
    </div>
  );
}
