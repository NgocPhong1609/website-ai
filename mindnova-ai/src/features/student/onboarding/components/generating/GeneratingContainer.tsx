"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getErrorMessage } from "@/src/shared/lib/user-error";
import { generatePlan } from "../../api";
import { GENERATING_STAGES } from "../../constants";
import { buildPlanPayload, useStepGuard } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { OnboardingShell } from "../shared/OnboardingShell";
import { StepSkeleton } from "../shared/StepParts";

const STAGE_INTERVAL_MS = 1800;
/** Keeps the screen from flashing when the backend answers instantly. */
const MIN_DURATION_MS = 1500;
const ERROR_FALLBACK = "Chưa thể tạo lộ trình học. Vui lòng thử lại.";

export default function GeneratingContainer() {
  const router = useRouter();
  const ready = useStepGuard("generating");
  const setPlan = useOnboardingStore((s) => s.setPlan);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const startedAttempt = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || startedAttempt.current === attempt) return;
    startedAttempt.current = attempt;

    const state = useOnboardingStore.getState();
    if (state.plan) {
      router.replace("/onboarding/plan");
      return;
    }
    const payload = buildPlanPayload(state);
    if (!payload) return;

    setError(null);
    setStage(0);
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_DURATION_MS));

    Promise.all([generatePlan(payload), minDelay])
      .then(([plan]) => {
        setPlan(plan);
        if (mounted.current) router.replace("/onboarding/plan");
      })
      .catch((err) => {
        if (mounted.current) setError(getErrorMessage(err, ERROR_FALLBACK));
      });
  }, [ready, attempt, router, setPlan]);

  useEffect(() => {
    if (!ready || error) return;
    const timer = setInterval(() => {
      setStage((current) => Math.min(current + 1, GENERATING_STAGES.length - 1));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [ready, error, attempt]);

  if (!ready) {
    return (
      <OnboardingShell hideSkip>
        <StepSkeleton cards={0} />
      </OnboardingShell>
    );
  }

  if (error) {
    return (
      <OnboardingShell className="items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertCircle className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Chưa thể tạo lộ trình học</h1>
          <p role="alert" className="mt-2 text-sm leading-relaxed text-rose-700">{error}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Thử lại
            </button>
            <Link
              href="/onboarding/topics"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Sửa câu trả lời
            </Link>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell hideSkip className="items-center justify-center">
      <div className="w-full max-w-md text-center" role="status" aria-live="polite">
        <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-100 motion-reduce:animate-none" aria-hidden />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <Sparkles className="h-9 w-9" aria-hidden />
          </span>
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AI đang thiết kế lộ trình…</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Quá trình này thường mất dưới 30 giây. Vui lòng không đóng trang.
        </p>

        <ol className="mt-8 space-y-2 text-left">
          {GENERATING_STAGES.map((label, index) => {
            const done = index < stage;
            const active = index === stage;
            return (
              <li
                key={label}
                className={twMerge(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                  active ? "border-blue-200 bg-white font-semibold text-slate-900 shadow-sm" : "border-transparent",
                  done && "text-slate-700",
                  !done && !active && "text-slate-400",
                )}
              >
                <span
                  className={twMerge(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    done && "bg-emerald-500 text-white",
                    active && "text-blue-600",
                    !done && !active && "border-2 border-slate-200",
                  )}
                  aria-hidden
                >
                  {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  {active && <Loader2 className="h-5 w-5 animate-spin" />}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      </div>
    </OnboardingShell>
  );
}
