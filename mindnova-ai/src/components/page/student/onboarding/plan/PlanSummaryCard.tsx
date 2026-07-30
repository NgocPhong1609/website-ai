import { twMerge } from "tailwind-merge";

export interface PlanSummaryCardProps {
  goal: string;
  level: string;
  topics: string[];
  freeTime: string;
  estimatedTime: string;
}

const NEURAL_NODES = [
  { top: "22%", left: "48%", size: 9, glow: "#4cd7f6" },
  { top: "52%", left: "22%", size: 6, glow: "#6B6BFF" },
  { top: "40%", left: "74%", size: 7, glow: "#4cd7f6" },
  { top: "72%", left: "56%", size: 5, glow: "#6B6BFF" },
  { top: "18%", left: "30%", size: 4, glow: "#4cd7f6" },
  { top: "66%", left: "18%", size: 3, glow: "#6B6BFF" },
  { top: "20%", left: "78%", size: 3, glow: "#4cd7f6" },
  { top: "80%", left: "36%", size: 3, glow: "#6B6BFF" },
  { top: "48%", left: "10%", size: 2, glow: "#4cd7f6" },
] as const;

const LEVEL_BADGE_CLASS: Record<string, string> = {
  Beginner: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20",
  Intermediate: "bg-[#6B6BFF]/10 text-[#6B6BFF] border-[#6B6BFF]/20",
  Advanced: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
};

function NeuralMap() {
  return (
    <div className="relative w-full h-28 rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#060d2b]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,215,246,0.28)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(70,72,212,0.38)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(76,215,246,0.18)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(107,107,255,0.20)_0%,transparent_70%)] animate-pulse" />

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

      <div className="absolute inset-0 flex flex-col justify-end p-3 gap-1">
        <span className="text-[9px] font-mono tracking-[0.18em] text-[#4cd7f6]/60 font-bold uppercase">
          AI Neural Map — Calibrated
        </span>
        <div className="flex gap-1">
          {[3, 2, 1].map((flex, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6]"
              style={{ flex, opacity: 0.85 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F0F0F7] last:border-0">
      <div className="flex items-center gap-2 text-[11px] text-[#84849A] font-medium">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-[11px] font-bold text-[#131B2E]">{value}</div>
    </div>
  );
}

export function PlanSummaryCard({
  goal,
  level,
  topics,
  freeTime,
  estimatedTime,
}: PlanSummaryCardProps) {
  const levelClass = LEVEL_BADGE_CLASS[level] ?? "bg-[#F0F0F7] text-[#84849A] border-[#E2E2EA]";

  return (
    <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] text-white flex items-center justify-center text-xs shadow-sm font-black">
          ⚡
        </div>
        <h2 className="text-sm font-extrabold text-[#131B2E]">Study Profile</h2>
      </div>

      <div className="bg-white/90 backdrop-blur-md border border-[#E8E8F0] rounded-2xl p-4 shadow-sm flex flex-col gap-1">
        <SummaryRow
          icon="🎯"
          label="Target Goal"
          value={<span className="max-w-[130px] truncate block text-right" title={goal}>{goal || "—"}</span>}
        />

        <SummaryRow
          icon="📊"
          label="Curr. Level"
          value={<span className={twMerge("px-2.5 py-0.5 rounded-full border text-[10px] font-black", levelClass)}>{level || "—"}</span>}
        />

        <SummaryRow
          icon="⏱️"
          label="Daily Commitment"
          value={<span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-100">{freeTime.split(" - ")[0]}</span>}
        />

        <SummaryRow
          icon="📚"
          label="Domain Topics"
          value={<span className="bg-[#6B6BFF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{topics.length} selected</span>}
        />

        <SummaryRow
          icon="🗓️"
          label="Est. Duration"
          value={<span className="text-[#4648D4] bg-[#6B6BFF]/10 font-black px-2.5 py-0.5 rounded-full">{estimatedTime}</span>}
        />
      </div>

      <NeuralMap />

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-0.5">
          {topics.slice(0, 5).map((t, i) => (
            <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#6B6BFF]/10 text-[#4648D4] border border-[#6B6BFF]/20">
              {t}
            </span>
          ))}
          {topics.length > 5 && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F0F0F7] text-[#84849A]">
              +{topics.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
