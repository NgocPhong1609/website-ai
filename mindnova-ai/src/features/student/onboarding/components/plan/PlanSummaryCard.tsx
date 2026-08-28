import { twMerge } from "tailwind-merge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanSummaryCardProps {
 goal: string;
 level: string;
 topics: string[];
 estimatedTime: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NEURAL_NODES = [
 { top: "22%", left: "48%", size: 9, glow: "#C0392B" },
 { top: "52%", left: "22%", size: 6, glow: "#C0392B" },
 { top: "40%", left: "74%", size: 7, glow: "#C0392B" },
 { top: "72%", left: "56%", size: 5, glow: "#C0392B" },
 { top: "18%", left: "30%", size: 4, glow: "#C0392B" },
 { top: "66%", left: "18%", size: 3, glow: "#C0392B" },
 { top: "20%", left: "78%", size: 3, glow: "#C0392B" },
 { top: "80%", left: "36%", size: 3, glow: "#C0392B" },
 { top: "48%", left: "10%", size: 2, glow: "#C0392B" },
] as const;

const LEVEL_BADGE_CLASS: Record<string, string> = {
 Beginner: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20",
 Intermediate: "bg-[#FAF7F2] text-[#C0392B] border-[#E8E2D9]",
 Advanced: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Decorative neural map visualization — reuses pattern from AiProjectionCard */
function NeuralMap() {
 return (
 <div
 className="relative w-full h-28 rounded-2xl overflow-hidden"
 aria-hidden="true"
 >
 {/* Dark space background */}
 <div className="absolute inset-0 bg-[#060d2b]" />

 {/* Ambient glow layers */}
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,215,246,0.28)_0%,transparent_65%)]" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(70,72,212,0.38)_0%,transparent_55%)]" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(76,215,246,0.18)_0%,transparent_50%)]" />

 {/* Pulsing active overlay */}
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(107,107,255,0.20)_0%,transparent_70%)] animate-pulse" />

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

 {/* Bottom label row */}
 <div className="absolute inset-0 flex flex-col justify-end p-3 gap-1">
 <span className="text-[9px] font-mono tracking-[0.18em] text-[#C0392B]/50 uppercase">
 AI Neural Map — Active
 </span>
 <div className="flex gap-1">
 {[3, 2, 1].map((flex, i) => (
 <div
 key={i}
 className="h-0.5 rounded-full bg-[#C0392B] "
 style={{ flex, opacity: 0.65 }}
 />
 ))}
 </div>
 </div>
 </div>
 );
}

interface SummaryRowProps {
 icon: React.ReactNode;
 label: string;
 value: React.ReactNode;
}

function SummaryRow({ icon, label, value }: SummaryRowProps) {
 return (
 <div className="flex items-center justify-between py-2.5 border-b border-[#F0F0F7] last:border-0">
 <div className="flex items-center gap-2 text-[11px] text-[#84849A]">
 {icon}
 <span>{label}</span>
 </div>
 <div className="text-[11px] font-semibold text-[#131B2E]">{value}</div>
 </div>
 );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TargetIcon() {
 return (
 <></>
 );
}

function LevelIcon() {
 return (
 <></>
 );
}

function BookIcon() {
 return (
 <></>
 );
}

function ClockIcon() {
 return (
 <></>
 );
}

function BoltIcon() {
 return (
 <></>
 );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PlanSummaryCard({ goal, level, topics, estimatedTime }: PlanSummaryCardProps) {
 const levelClass = LEVEL_BADGE_CLASS[level] ?? "bg-[#F0F0F7] text-[#84849A] border-[#E2E2EA]";

 return (
 <div className="w-[240px] shrink-0 flex flex-col gap-3">
 {/* Header label */}
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg bg-[#C0392B] flex items-center justify-center shadow-[0_2px_8px_rgba(107,107,255,0.4)]">
 <BoltIcon />
 </div>
 <h2 className="text-sm font-bold text-[#131B2E]">Your Profile</h2>
 </div>

 {/* Main card */}
 <div className="bg-white border border-[#E8E8F0] rounded-2xl p-4 shadow-[0_2px_12px_rgba(107,107,255,0.06)]">
 {/* Goal */}
 <SummaryRow
 icon={<TargetIcon />}
 label="Goal"
 value={
 <span className="max-w-[110px] truncate block text-right" title={goal}>
 {goal || "—"}
 </span>
 }
 />

 {/* Level */}
 <SummaryRow
 icon={<LevelIcon />}
 label="Level"
 value={
 <span className={twMerge("px-2 py-0.5 rounded-full border text-[10px] font-bold", levelClass)}>
 {level || "—"}
 </span>
 }
 />

 {/* Topics */}
 <SummaryRow
 icon={<BookIcon />}
 label="Topics"
 value={
 <span className="bg-[#FAF7F2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
 {topics.length} selected
 </span>
 }
 />

 {/* Estimated time */}
 <SummaryRow
 icon={<ClockIcon />}
 label="Est. time"
 value={
 <span className="text-[#C0392B] bg-[#FAF7F2] px-2 py-0.5 rounded-full">
 {estimatedTime}
 </span>
 }
 />
 </div>

 {/* Neural map visualization */}
 <NeuralMap />

 {/* Topics list pills */}
 {topics.length > 0 && (
 <div className="flex flex-wrap gap-1.5 px-0.5">
 {topics.slice(0, 4).map((t, i) => (
 <span
 key={i}
 className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#C0392B] border border-[#E8E2D9]"
 >
 {t}
 </span>
 ))}
 {topics.length > 4 && (
 <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#F0F0F7] text-[#84849A]">
 +{topics.length - 4} more
 </span>
 )}
 </div>
 )}
 </div>
 );
}
