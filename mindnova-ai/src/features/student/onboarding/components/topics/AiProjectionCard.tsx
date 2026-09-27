import { twMerge } from "tailwind-merge";
import { Gauge } from "lucide-react";
import { COMPLEXITY_CONFIG } from "@/src/features/student/onboarding/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiProjectionCardProps {
 selectedCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_INSIGHT_PLACEHOLDER =
 "Chọn chủ đề ở trên để xem dự báo độ khó phù hợp với bạn.";

const AI_INSIGHT_ACTIVE =
 "Chọn thêm chủ đề giúp AI tìm được liên kết sâu hơn giữa các lĩnh vực.";

/** Decorative neural network nodes rendered in the visualization banner. */
const NEURAL_NODES = [
 { top: "28%", left: "50%", size: 7, glow: "#3B82F6" },
 { top: "55%", left: "28%", size: 4, glow: "#3B82F6" },
 { top: "42%", left: "72%", size: 5, glow: "#3B82F6" },
 { top: "72%", left: "56%", size: 3, glow: "#3B82F6" },
 { top: "18%", left: "34%", size: 3, glow: "#3B82F6" },
 { top: "66%", left: "18%", size: 2, glow: "#3B82F6" },
 { top: "22%", left: "78%", size: 2, glow: "#3B82F6" },
 { top: "48%", left: "14%", size: 2, glow: "#3B82F6" },
 { top: "80%", left: "36%", size: 2, glow: "#3B82F6" },
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
 return <Gauge size={16} />;
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
 <p className="text-xs font-bold text-slate-900 truncate">
 Độ phức tạp kỹ năng
 </p>
 <p className="text-[11px] text-slate-500 truncate">{label}</p>
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
 ? " bg-blue-500 "
 : "bg-slate-200",
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
 aria-label={`Độ phức tạp: ${label}`}
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
 <span className="text-[9px] font-mono tracking-[0.2em] text-blue-500/50 uppercase">
 Bản đồ kiến thức AI
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
 <span className="text-slate-400">Thời gian dự kiến để thành thạo</span>
 <span className="font-semibold text-blue-500">
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
 
 <h2 className="text-sm font-bold text-slate-900">Dự báo của AI</h2>
 </div>

 {/* Complexity card */}
 <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(59, 130, 246,0.05)]">
 <ComplexityMeter
 label={complexity.label}
 percent={complexity.percent}
 level={complexity.level}
 />

 {hasSelection && (
 <>
 <div className="h-px bg-slate-100" />
 <TimeEstimate level={complexity.level} />
 </>
 )}

 {/* AI insight */}
 <div
 className={twMerge(
 "flex gap-2 p-2.5 rounded-xl transition-all duration-300",
 hasSelection
 ? " bg-blue-500 border border-slate-200"
 : "bg-[#FAFAFA] border border-slate-100",
 )}
 >
 <></>
 <p
 className={twMerge(
 "text-[10.5px] leading-relaxed transition-colors duration-300",
 hasSelection ? "text-blue-500" : "text-slate-400",
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
