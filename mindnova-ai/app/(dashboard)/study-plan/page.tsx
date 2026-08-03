import { ChatPanel, ContextPanel } from "@/src/features/student/ai-study-plan";
import { getStudyPlanOverview } from "@/src/features/student/ai-study-plan/services/study-plan.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Study Plan | MindNova AI",
  description: "Your AI-powered personalized study roadmap and real-time interactive tutor.",
};

export default async function AIStudyPlanPage() {
  // Fetch Study Plan data directly in React Server Component (RSC) per checklist.md Rule #4
  const overview = await getStudyPlanOverview();
  const { activeSyllabus, coreConcepts, lessonResources, aiInsight, initialMessages } = overview;

  const currentIdx = activeSyllabus.currentModuleIndex ?? 4;
  const totalMods = activeSyllabus.totalModules ?? 8;
  const progressPct = activeSyllabus.progressPercentage ?? 65;
  const completedTop = activeSyllabus.completedTopics ?? 13;
  const totalTop = activeSyllabus.totalTopics ?? 20;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-8 min-h-[calc(100vh-4.5rem)]">
      {/* ─── Top Syllabus Control Center (Luminous Horizontal Hero) ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF2FF]/95 via-[#F6F7FF] to-[#E0F2FE]/85 border border-[#6B6BFF]/30 p-6 sm:p-8 shadow-[0_10px_36px_rgba(107,107,255,0.08)] hover:shadow-[0_14px_44px_rgba(107,107,255,0.14)] transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Animated luminous glow orbs in background */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#6B6BFF]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/35 text-xs font-bold text-[#4648D4] uppercase tracking-wider shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span>Active Syllabus • Module {currentIdx} of {totalMods}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A2E] tracking-tight leading-tight">
            {activeSyllabus.title.split(" ")[0]} {" "}
            <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#0D9488] bg-clip-text text-transparent font-bold">
              {activeSyllabus.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-medium">
            {activeSyllabus.description}
          </p>
        </div>

        {/* Interactive Glassmorphism Module Progress Widget */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-[#6B6BFF]/30 w-full lg:w-[340px] shrink-0 flex flex-col justify-between shadow-[0_8px_30px_rgba(70,72,212,0.08)] hover:-translate-y-1 hover:border-[#6B6BFF]/60 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#D1FAE5]/80 text-[#0D9488] flex items-center justify-center text-xs font-bold shadow-2xs">🚀</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7878A0]">Module Velocity</span>
            </div>
            <span className="text-xs font-bold text-[#10B981] bg-[#D1FAE5] px-2.5 py-1 rounded-full border border-[#10B981]/30 shadow-2xs">
              {activeSyllabus.statusBadge || "On Track"}
            </span>
          </div>
          
          <div className="flex items-baseline justify-between mb-3.5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight">{progressPct}%</span>
              <span className="text-xs font-bold text-[#6B6BFF]">done</span>
            </div>
            <span className="text-xs font-bold text-[#4648D4] bg-[#EEF2FF] px-3 py-1 rounded-lg border border-[#6B6BFF]/20">
              {completedTop} / {totalTop} topics
            </span>
          </div>
          
          <div className="w-full h-3 bg-[#EAECEF] rounded-full overflow-hidden p-0.5 border border-[#EAEAF4]">
            <div
              className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_12px_rgba(107,107,255,0.6)] transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* ─── Main Interactive Workspace (Left: Chat Room | Right: Study Inspector) ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Primary Interactive Chat Area (Center/Left - 8 cols) */}
        <div className="xl:col-span-8 w-full">
          <ChatPanel initialMessages={initialMessages} syllabusTitle={activeSyllabus.title} />
        </div>

        {/* Contextual Study Inspector (Far Right - 4 cols) */}
        <div className="xl:col-span-4 w-full">
          <ContextPanel
            coreConcepts={coreConcepts}
            lessonResources={lessonResources}
            aiInsight={aiInsight}
            moduleBadge={`Module ${currentIdx}`}
          />
        </div>
      </div>
    </div>
  );
}
