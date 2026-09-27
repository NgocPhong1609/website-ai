"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { MAX_TOPICS, ONBOARDING_TIMES } from "../../constants";
import { useOnboardingSummary, useStepGuard } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { OnboardingShell } from "../shared/OnboardingShell";
import { OptionCard, StepActions, StepIntro, StepSkeleton } from "../shared/StepParts";

export default function TopicsContainer() {
  const router = useRouter();
  const ready = useStepGuard("topics");
  const { goal } = useOnboardingSummary();
  const topics = useOnboardingStore((s) => s.topics);
  const timeId = useOnboardingStore((s) => s.timeId);
  const toggleTopic = useOnboardingStore((s) => s.toggleTopic);
  const selectTime = useOnboardingStore((s) => s.selectTime);

  if (!ready || !goal) {
    return (
      <OnboardingShell step="topics">
        <StepSkeleton cards={4} />
      </OnboardingShell>
    );
  }

  const limitReached = topics.length >= MAX_TOPICS;

  return (
    <OnboardingShell step="topics">
      <StepIntro
        eyebrow="Bước 3/3"
        title="Bạn muốn tập trung vào đâu?"
        description="Chọn chủ đề quan tâm và thời gian học mỗi ngày để AI sắp xếp khối lượng bài học vừa sức."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <fieldset className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <legend className="sr-only">Chủ đề quan tâm</legend>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-semibold text-slate-900">
              Chủ đề quan tâm <span className="font-normal text-slate-500">(không bắt buộc)</span>
            </h2>
            <span className="shrink-0 text-sm text-slate-500" aria-live="polite">
              {topics.length}/{MAX_TOPICS}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {goal.topics.map((topic) => {
              const checked = topics.includes(topic);
              const disabled = limitReached && !checked;
              return (
                <label
                  key={topic}
                  className={twMerge(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-blue-500 has-[input:focus-visible]:ring-offset-1",
                    checked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
                    disabled && "cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-700",
                  )}
                >
                  <input
                    type="checkbox"
                    name="topics"
                    value={topic}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleTopic(topic)}
                    className="sr-only"
                  />
                  {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                  {topic}
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {limitReached
              ? `Bạn đã chọn tối đa ${MAX_TOPICS} chủ đề. Bỏ chọn một chủ đề để đổi.`
              : "Bỏ trống nếu bạn muốn AI tự đề xuất chủ đề theo mục tiêu."}
          </p>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <legend className="sr-only">Thời gian học mỗi ngày</legend>
          <h2 className="mb-4 font-semibold text-slate-900">Thời gian học mỗi ngày</h2>
          <div className="flex flex-col gap-2.5">
            {ONBOARDING_TIMES.map((time) => (
              <OptionCard
                key={time.id}
                name="time"
                value={time.id}
                checked={timeId === time.id}
                title={time.title}
                description={time.description}
                icon={time.icon}
                layout="inline"
                onChange={() => selectTime(time.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <StepActions
        backHref="/onboarding/skills"
        continueLabel="Tạo lộ trình"
        canContinue={timeId !== null}
        hint={timeId ? undefined : "Chọn thời gian học mỗi ngày để tạo lộ trình"}
        onContinue={() => router.push("/onboarding/generating")}
      />
    </OnboardingShell>
  );
}
