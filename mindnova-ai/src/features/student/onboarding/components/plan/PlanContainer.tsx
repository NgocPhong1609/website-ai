"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CalendarClock, ChevronRight, Clock3, Info, PartyPopper, RotateCcw, Target, TrendingUp } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useStepGuard } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import type { PlanPhase } from "../../types";
import { OnboardingShell } from "../shared/OnboardingShell";
import { StepSkeleton } from "../shared/StepParts";
import { LessonDetailModal } from "./LessonDetailModal";
import { RecommendedCourseCard } from "./RecommendedCourseCard";

export default function PlanContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ready = useStepGuard("plan");
  const plan = useOnboardingStore((s) => s.plan);
  const reset = useOnboardingStore((s) => s.reset);
  const [lesson, setLesson] = useState<string | null>(null);
  const closeLesson = useCallback(() => setLesson(null), []);

  if (!ready || !plan) {
    return (
      <OnboardingShell>
        <StepSkeleton cards={3} />
      </OnboardingShell>
    );
  }

  const { profile, learning_path: phases } = plan;

  const handleStart = () => {
    // Dashboard and study plan read the plan saved on the server.
    void queryClient.invalidateQueries({ queryKey: ["student"] });
    router.push("/study-plan");
    router.refresh();
  };

  const handleRestart = () => {
    reset();
    router.push("/onboarding/goal");
  };

  const regenerate = () => {
    useOnboardingStore.setState({ plan: null });
    router.push("/onboarding/generating");
  };

  return (
    <OnboardingShell>
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <PartyPopper className="h-3.5 w-3.5" aria-hidden />
          Lộ trình đã sẵn sàng
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Lộ trình <span className="text-blue-600">{profile.goal}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base text-slate-600">
          {phases.length} giai đoạn được sắp xếp theo trình độ và thời gian của bạn. Chọn một bài học để xem AI phân tích chi tiết.
        </p>
      </div>

      {plan.source === "fallback" && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center">
          <Info className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <p className="flex-1">
            AI đang bận nên đây là lộ trình mẫu dựng từ câu trả lời của bạn. Bạn có thể tạo lại để nhận lộ trình chi tiết hơn.
          </p>
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Tạo lại
          </button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
        <ol className="space-y-4" aria-label="Các giai đoạn của lộ trình">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.phase} phase={phase} isFirst={index === 0} onLessonClick={setLesson} />
          ))}
        </ol>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Hồ sơ học tập</h2>
            <dl className="mt-3 divide-y divide-slate-100 text-sm">
              <SummaryRow icon={Target} label="Mục tiêu" value={profile.goal} />
              <SummaryRow icon={TrendingUp} label="Trình độ" value={profile.level} />
              <SummaryRow icon={Clock3} label="Mỗi ngày" value={profile.time_available} />
              <SummaryRow icon={CalendarClock} label="Dự kiến" value={profile.est_time} />
            </dl>
            {profile.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Bắt đầu học
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Khám phá thêm khóa học
            </Link>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Trả lời lại từ đầu
            </button>
          </div>
        </aside>
      </div>

      <LessonDetailModal lessonTitle={lesson} goal={profile.goal} onClose={closeLesson} />
    </OnboardingShell>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <dt className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </dt>
      <dd className="text-right font-medium text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function PhaseCard({ phase, isFirst, onLessonClick }: { phase: PlanPhase; isFirst: boolean; onLessonClick: (lesson: string) => void }) {
  return (
    <li className={twMerge("rounded-xl border bg-white p-5 sm:p-6", isFirst ? "border-blue-200 shadow-sm" : "border-slate-200")}>
      <div className="flex items-start gap-4">
        <span
          className={twMerge(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isFirst ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
          )}
        >
          {phase.phase}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold text-slate-900">{phase.title}</h2>
            {phase.duration && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                <Clock3 className="h-3 w-3" aria-hidden />
                {phase.duration}
              </span>
            )}
            {isFirst && <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Bắt đầu tại đây</span>}
          </div>
          {phase.description && <p className="mt-1 text-sm text-slate-600">{phase.description}</p>}

          <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-100">
            {phase.lessons.map((lesson) => (
              <li key={lesson.name}>
                <button
                  type="button"
                  onClick={() => onLessonClick(lesson.name)}
                  className="group flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                >
                  <span className="flex-1 font-medium text-slate-800 group-hover:text-blue-700">{lesson.name}</span>
                  {lesson.duration && <span className="shrink-0 text-xs text-slate-500">{lesson.duration}</span>}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          {phase.courses.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Khóa học gợi ý</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {phase.courses.map((course) => (
                  <RecommendedCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
