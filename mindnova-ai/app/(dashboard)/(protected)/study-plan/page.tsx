import { StudyPlanWorkspace } from "@/src/features/student/ai-study-plan";
import { getStudyPlanOverview } from "@/src/features/student/ai-study-plan/services/study-plan.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Study Plan | MindNova AI",
  description: "Your personalized AI study roadmap and interactive learning co-pilot.",
};

export default async function AIStudyPlanPage() {
  const overview = await getStudyPlanOverview();
  const { activeSyllabus, coreConcepts, lessonResources, aiInsight, initialMessages } = overview;

  const currentIdx = activeSyllabus?.currentModuleIndex ?? 1;
  const totalMods = activeSyllabus?.totalModules ?? 1;
  const progressPct = activeSyllabus?.progressPercentage ?? 0;
  const completedTop = activeSyllabus?.completedTopics ?? 0;
  const totalTop = activeSyllabus?.totalTopics ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
      {/* ─── Standardized Universal Hero Banner Blueprint ─── */}
      {activeSyllabus ? (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)] w-full">
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
                Lộ trình học AI • Module {currentIdx} / {totalMods}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
                {activeSyllabus.title.split(" ")[0]} {" "}
                <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent font-bold drop-shadow-2xs">
                  {activeSyllabus.title.split(" ").slice(1).join(" ")}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
                {activeSyllabus.description}
              </p>
            </div>

            {/* Synchronized Universal Wide Mastery Card */}
            <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-full flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Tiến độ lộ trình ↗</span>
                <span className="text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                  Đúng tiến độ
                </span>
              </div>

              <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
                <div>
                  <span className="text-[#4648D4]">{progressPct}%</span>
                  <span className="text-xs font-medium text-[#9090B0] ml-1.5">hoàn thành</span>
                </div>
                <span className="text-xs font-semibold text-[#64647A]">
                  {completedTop} / {totalTop} chủ đề
                </span>
              </div>

              <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
                <div
                  className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:brightness-110"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <p className="text-xs font-semibold text-[#6B6BFF] mt-3 flex items-center justify-between gap-4">
                <span>🔥 Tiếp tục giữ vững phong độ nhé!</span>
                <span className="text-[#4648D4] font-bold hover:underline cursor-pointer">Tiếp tục ➔</span>
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-2xl bg-[#F8F9FE] border border-[#E8EAF4] p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-2">Chưa có Lộ trình học</h2>
          <p className="text-[#64647A] text-sm mb-4">Bạn cần đăng ký khóa học để hệ thống tạo Lộ trình AI cá nhân hóa.</p>
          <a href="/explore" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4648D4] text-white rounded-xl font-medium text-sm transition-colors hover:bg-[#3234a8]">
            Khám phá Khóa học ➔
          </a>
        </section>
      )}

      {/* ─── Main Bidirectional Workspace ─── */}
      <StudyPlanWorkspace
        initialMessages={initialMessages}
        syllabusTitle={activeSyllabus?.title || "Chưa có chủ đề"}
        coreConcepts={coreConcepts}
        lessonResources={lessonResources}
        aiInsight={aiInsight}
        currentModuleIndex={currentIdx}
      />
    </div>
  );
}
