import { twMerge } from "tailwind-merge";
import type { GeneratingStepStatus } from "@/src/features/student/onboarding/types";

// ─── Status Icons ─────────────────────────────────────────────────────────────

function CompletedIcon() {
  return (
    <></>
  );
}

function InProgressIcon() {
  return (
    <div className="w-7 h-7 rounded-full border-2 border-blue-500 border-t-transparent flex items-center justify-center shrink-0 animate-spin" />
  );
}

function PendingIcon() {
  return (
    <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-slate-300" />
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
  "in-progress": "Đang xử lý",
  pending: "Pending",
};

const STATUS_LABEL_CLASS: Record<GeneratingStepStatus, string> = {
  completed: "text-blue-500 font-semibold",
  "in-progress": "text-emerald-600 font-semibold",
  pending: "text-slate-500",
};

// ─── Progress Bar (only for in-progress) ─────────────────────────────────────

function ProgressBar() {
  return (
    <div className="mt-3 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full rounded-full animate-progress-fill"
        style={{
          background: "linear-gradient(to right, #3B82F6, #27AE60)",
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
        isInProgress && "bg-white border border-slate-200 shadow-sm",
        !isInProgress && !isPending && "bg-white border border-slate-200",
        isPending && "bg-transparent",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon />
          <span
            className={twMerge(
              "text-sm font-medium",
              isPending ? "text-slate-500" : "text-slate-900",
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
