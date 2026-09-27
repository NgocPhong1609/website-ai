import Link from "next/link";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { SidebarBrand } from "@/src/features/student/layout/components/SidebarBrand";
import { ONBOARDING_STEPS } from "../../constants";
import type { OnboardingStepKey } from "../../types";

interface OnboardingShellProps {
  /** Highlights the progress bar; omit on welcome / generating / plan screens. */
  step?: OnboardingStepKey;
  /** Hide the "skip" link (e.g. while the plan is being generated). */
  hideSkip?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function OnboardingShell({ step, hideSkip = false, className, children }: OnboardingShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <SidebarBrand />
          {!hideSkip && (
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Bỏ qua
            </Link>
          )}
        </div>
      </header>

      {step && <OnboardingProgress current={step} />}

      <main className={twMerge("mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12", className)}>
        {children}
      </main>
    </div>
  );
}

function OnboardingProgress({ current }: { current: OnboardingStepKey }) {
  const currentIndex = ONBOARDING_STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Tiến độ thiết lập" className="border-b border-slate-200 bg-white">
      <ol className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        {ONBOARDING_STEPS.map((s, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const label = (
            <>
              <span
                className={twMerge(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-blue-600 text-white",
                  active && "bg-blue-50 text-blue-700 ring-2 ring-blue-600",
                  !done && !active && "bg-slate-100 text-slate-400",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : index + 1}
              </span>
              <span
                className={twMerge(
                  "hidden text-sm font-medium sm:inline",
                  active ? "text-slate-900" : done ? "text-slate-600" : "text-slate-400",
                )}
              >
                {s.label}
              </span>
            </>
          );

          return (
            <li key={s.key} className="flex flex-1 items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
              {done ? (
                <Link href={s.href} className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={`Quay lại bước ${index + 1}: ${s.label}`}>
                  {label}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  {label}
                  <span className="sr-only">{active ? "(bước hiện tại)" : ""}</span>
                </span>
              )}
              {index < ONBOARDING_STEPS.length - 1 && (
                <span className={twMerge("h-0.5 flex-1 rounded-full", done ? "bg-blue-600" : "bg-slate-200")} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
