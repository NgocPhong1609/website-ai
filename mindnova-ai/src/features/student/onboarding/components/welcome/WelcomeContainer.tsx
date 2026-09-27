"use client";

import Link from "next/link";
import { ArrowRight, Compass, Map, Sparkles, CheckCircle2 } from "lucide-react";
import { WELCOME_HIGHLIGHTS } from "../../constants";
import { useOnboardingHydration } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { OnboardingShell } from "../shared/OnboardingShell";

const PREVIEW_PHASES = [
  { 
    title: "Nền tảng", 
    desc: "Xây dựng kiến thức gốc rễ vững chắc",
    highlight: "Khóa học lộ trình chuẩn"
  },
  { 
    title: "Thực hành chuyên sâu", 
    desc: "Áp dụng vào các bài toán nhỏ",
    highlight: "Bài tập & Quiz AI chấm"
  },
  { 
    title: "Dự án và hoàn thiện", 
    desc: "Sẵn sàng áp dụng vào thực tế",
    highlight: "Thử thách & Chứng chỉ"
  },
];

export default function WelcomeContainer() {
  const hydrated = useOnboardingHydration();
  const hasPlan = useOnboardingStore((s) => s.plan !== null);

  return (
    <OnboardingShell className="justify-center">
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12 xl:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Học tập cùng AI
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Chào mừng đến với <span className="text-blue-600">MindNova AI</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Trả lời 3 câu hỏi ngắn để AI thiết kế lộ trình học phù hợp với mục tiêu, trình độ và thời gian của bạn.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding/goal"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Bắt đầu
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {hydrated && hasPlan ? (
              <Link
                href="/onboarding/plan"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Map className="h-4 w-4" aria-hidden />
                Xem lộ trình vừa tạo
              </Link>
            ) : (
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Compass className="h-4 w-4" aria-hidden />
                Để sau, khám phá khóa học
              </Link>
            )}
          </div>

          <ul className="mt-10 flex flex-col md:flex-row flex-wrap gap-4">
            {WELCOME_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex-1 min-w-[200px] flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-col pt-0.5">
                  <p className="text-[13.5px] font-bold text-slate-900 leading-snug">{title}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <PlanPreview />
      </div>
    </OnboardingShell>
  );
}

/** Illustration of what the learner gets at the end of onboarding. */
function PlanPreview() {
  return (
    <div className="hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:block" aria-hidden>
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Map className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Lộ trình của bạn</p>
          <p className="text-xs text-slate-500">3 giai đoạn · gợi ý khóa học phù hợp</p>
        </div>
      </div>
      <ol className="mt-5 space-y-4">
        {PREVIEW_PHASES.map((phase, index) => (
          <li key={phase.title} className="flex gap-3">
            <span
              className={
                index === 0
                  ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500"
              }
            >
              {index + 1}
            </span>
            <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:bg-white hover:shadow-sm">
              <p className="text-[13.5px] font-bold text-slate-900">{phase.title}</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{phase.desc}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-blue-600 shadow-sm border border-slate-100">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                {phase.highlight}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
