import { twMerge } from "tailwind-merge";
import type { GeneratingStepStatus } from "@/src/features/student/onboarding/types";

// ─── Status Icons ─────────────────────────────────────────────────────────────

function CompletedIcon() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#4648D4] flex items-center justify-center shrink-0">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function InProgressIcon() {
  return (
    <div className="w-7 h-7 rounded-full border-2 border-[#4648D4] border-t-transparent flex items-center justify-center shrink-0 animate-spin" />
  );
}

function PendingIcon() {
  return (
    <div className="w-7 h-7 rounded-full border-2 border-[#C7C4D7] flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-[#C7C4D7]" />
    </div>
  );
}

const STATUS_ICON_MAP: Record<GeneratingStepStatus, React.FC> = {
  completed: CompletedIcon,
  "in-progress": InProgressIcon,
  pending: PendingIcon,
};

// ─── Status Label ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<GeneratingStepStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  pending: "Pending",
};

const STATUS_LABEL_CLASS: Record<GeneratingStepStatus, string> = {
  completed: "text-[#4648D4] font-semibold",
  "in-progress": "text-[#00A896] font-semibold",
  pending: "text-[#84849A]",
};

// ─── Progress Bar (only for in-progress) ─────────────────────────────────────

function ProgressBar() {
  return (
    <div className="mt-3 h-1 w-full rounded-full bg-[#E2E2EA] overflow-hidden">
      <div
        className="h-full rounded-full animate-progress-fill"
        style={{
          background: "linear-gradient(to right, #4648D4, #00C2B3)",
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface StepItemProps {
  label: string;
  status: GeneratingStepStatus;
}

export function StepItem({ label, status }: StepItemProps) {
  const Icon = STATUS_ICON_MAP[status];
  const isInProgress = status === "in-progress";
  const isPending = status === "pending";

  return (
    <div
      className={twMerge(
        "w-full rounded-xl px-5 py-3.5 transition-colors",
        isInProgress && "bg-white border border-[#E2E2EA] shadow-sm",
        !isInProgress && !isPending && "bg-white border border-[#E2E2EA]",
        isPending && "bg-transparent",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon />
          <span
            className={twMerge(
              "text-sm font-medium",
              isPending ? "text-[#84849A]" : "text-[#131B2E]",
            )}
          >
            {label}
          </span>
        </div>
        <span
          className={twMerge("text-sm shrink-0", STATUS_LABEL_CLASS[status])}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {isInProgress && <ProgressBar />}
    </div>
  );
}
