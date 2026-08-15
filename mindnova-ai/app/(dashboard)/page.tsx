import Link from "next/link";
import { 
  AiSuggestionCard, 
  ContinueLearning, 
  DashboardStatsPanel, 
  AdvancedRecommendationsSection, 
} from "@/src/features/student/dashboard";
import { getDashboardOverview } from "@/src/features/student/dashboard/services/dashboard.service";

/**
 * React Server Component (RSC) for the student dashboard.
 * Designed with compact cards, eye-soothing typography, and seamless universal banner consistency.
 */
export default async function DashboardPage() {
  const dashboardData = await getDashboardOverview();
  const userName = dashboardData.user?.name ?? "Học viên MindNova";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1400px] w-full mx-auto min-h-[calc(100vh-4rem)]">
      
      {/* ─── Synchronized Universal Welcome Hero Banner matching /study-plan ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)] w-full">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              MindNova AI Co-Pilot • Hoạt động 24/7
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Chào mừng trở lại, <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent font-bold drop-shadow-2xs">{userName}! 🚀</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Chuỗi chuyên cần của bạn đang được duy trì vô cùng tích cực! Hiện tại bạn đạt hiệu suất rèn luyện vượt trội hơn 88% học viên cùng chuyên ngành trong tuần này.
            </p>
          </div>

          {/* Universal Wide Mastery Card matching /study-plan */}
          <Link href="/study-plan" className="group block shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300 text-decoration-none focus:outline-none">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Mục tiêu trong ngày ↗</span>
              <span className="text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                Đúng tiến độ
              </span>
            </div>
            
            <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
              <div>
                <span className="text-[#4648D4]">66%</span>
                <span className="text-xs font-medium text-[#9090B0] ml-1.5">hoàn thành</span>
              </div>
              <span className="text-xs font-semibold text-[#64647A]">
                2 / 3 bài học
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full w-[66%] shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:brightness-110" />
            </div>
            
            <p className="text-xs font-semibold text-[#6B6BFF] mt-3 flex items-center justify-between gap-4">
              <span>🔥 Chỉ còn 1 bài nữa là đạt mục tiêu!</span>
              <span className="text-[#4648D4] font-bold group-hover:underline">Vào học tiếp ➔</span>
            </p>
          </Link>
        </div>
      </section>

      {/* ─── Top Stats Section: Compact modular stat cards ─── */}
      <DashboardStatsPanel 
        overallProgress={dashboardData.overall_progress} 
        studyStreak={dashboardData.study_streak} 
        focusAreas={dashboardData.focus_areas} 
      />

      {/* ─── AI Co-Pilot Suggestion Box ─── */}
      <AiSuggestionCard suggestion={dashboardData.ai_suggestion} />

      {/* ─── Continue Learning Courses Grid ─── */}
      <ContinueLearning courses={dashboardData.courses} />

      {/* ─── Advanced Recommendations Section ─── */}
      <div className="w-full flex flex-col gap-8 border-t border-[#E6E6F0] pt-6">
        <AdvancedRecommendationsSection recommendations={dashboardData.advanced_recommendations} />
      </div>
      
    </div>
  );
}
