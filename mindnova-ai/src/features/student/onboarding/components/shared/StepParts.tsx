"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

// ─── Heading ─────────────────────────────────────────────────────────────────

export function StepIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}

// ─── Selectable card ─────────────────────────────────────────────────────────

interface OptionCardProps {
  name: string;
  type?: "radio" | "checkbox";
  value: string;
  checked: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  icon?: LucideIcon;
  layout?: "stacked" | "inline";
  onChange: () => void;
}

/**
 * Card-shaped radio/checkbox. Uses a real input so keyboard (Tab, arrows,
 * Space) and screen readers behave natively.
 */
export function OptionCard({
  name,
  type = "radio",
  value,
  checked,
  disabled = false,
  title,
  description,
  icon: Icon,
  layout = "stacked",
  onChange,
}: OptionCardProps) {
  const stacked = layout === "stacked";

  return (
    <label
      className={twMerge(
        "relative flex cursor-pointer rounded-xl border bg-white p-4 text-left transition-all sm:p-5",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-blue-500 has-[input:focus-visible]:ring-offset-2",
        stacked ? "flex-col gap-3" : "items-center gap-3",
        checked
          ? "border-blue-600 bg-blue-50/60 shadow-sm"
          : "border-slate-200 hover:border-blue-300 hover:shadow-sm",
        disabled && !checked && "cursor-not-allowed opacity-50 hover:border-slate-200 hover:shadow-none",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled && !checked}
        onChange={onChange}
        className="sr-only"
      />
      {Icon && (
        <span
          className={twMerge(
            "flex shrink-0 items-center justify-center rounded-lg transition-colors",
            stacked ? "h-11 w-11" : "h-9 w-9",
            checked ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600",
          )}
        >
          <Icon className={stacked ? "h-5 w-5" : "h-4 w-4"} aria-hidden />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{title}</span>
        {description && <span className="mt-1 block text-sm leading-relaxed text-slate-600">{description}</span>}
      </span>
      <span
        className={twMerge(
          "flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
          type === "radio" ? "rounded-full" : "rounded-md",
          stacked && "absolute right-4 top-4",
          checked ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white",
        )}
        aria-hidden
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </label>
  );
}

// ─── Footer actions ──────────────────────────────────────────────────────────

interface StepActionsProps {
  backHref?: string;
  continueLabel?: string;
  canContinue: boolean;
  hint?: string;
  onContinue: () => void;
}

export function StepActions({ backHref, continueLabel = "Tiếp tục", canContinue, hint, onContinue }: StepActionsProps) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-10 border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
      <div className="flex items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Quay lại
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {continueLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {hint && <p className="mt-2 text-right text-xs text-slate-500" aria-live="polite">{hint}</p>}
    </div>
  );
}

// ─── Loading placeholder (before answers are restored) ───────────────────────

export function StepSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div role="status" aria-busy="true" className="w-full">
      <span className="sr-only">Đang tải…</span>
      <div className="mx-auto mb-8 flex max-w-xl flex-col items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
