<<<<<<< HEAD
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
 * Fetches data on the server with Next.js caching enabled per checklist.md rules.
 */
export default async function DashboardPage() {
  const dashboardData = await getDashboardOverview();
  const userName = dashboardData.user?.name ?? "Future Leader";
=======
import {
  AiSuggestionCard,
  ContinueLearning,
  DashboardStatsPanel,
  ExploreCourses,
} from "@/src/features/student/dashboard";
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-10 p-6 lg:p-8 max-w-[1440px] w-full mx-auto min-h-[calc(100vh-4rem)]">
      {/* Top Row: Engaging, Luminous Welcome Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)] w-full">
        {/* Subtle animated background glow balls (refined and gentle) */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />
=======
    <div className="flex flex-col xl:flex-row gap-8 p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <AiSuggestionCard />
        <ContinueLearning />
        <ExploreCourses/>
      </div>
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              MindNova AI Copilot Synced
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent drop-shadow-2xs font-bold">{userName}!</span> 🚀
            </h1>
            
            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed">
              Your daily learning streak is active! You are performing better than <span className="text-[#4648D4] font-semibold bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#6B6BFF]/20">88%</span> of students on identical AI tracks this week.
            </p>
          </div>

          {/* Interactive Daily Target Widget */}
          <Link href="/study-plan" className="group block shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#6B6BFF]/20 flex flex-col items-center justify-center min-w-[185px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none">
            <div className="w-full flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Daily Target ↗</span>
              <span className="w-6 h-6 rounded-lg bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center text-xs font-semibold shadow-2xs">🎯</span>
            </div>
            
            <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline gap-1.5">
              <span className="text-[#4648D4]">2</span>
              <span className="text-xs font-medium text-[#9090B0]">/ 3 completed</span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full w-[66%] shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:w-[70%]" />
            </div>
            
            <p className="text-[11px] font-semibold text-[#6B6BFF] mt-2.5 flex items-center gap-1">
              <span>🔥 Just 1 lesson left!</span>
            </p>
          </Link>
        </div>
      </section>

      {/* Top Stats Section: Overall Progress & Gamification occupying 100% full screen width */}
      <DashboardStatsPanel 
        overallProgress={dashboardData.overall_progress} 
        studyStreak={dashboardData.study_streak} 
        focusAreas={dashboardData.focus_areas} 
      />

      {/* AI Co-Pilot Suggestion */}
      <AiSuggestionCard suggestion={dashboardData.ai_suggestion} />

      {/* Courses Progression Grid - now occupying full width of the monitor without right sidebar constraint */}
      <ContinueLearning courses={dashboardData.courses} />

      {/* Full-Width Recommendations Section */}
      <div className="w-full flex flex-col gap-14 border-t border-[#E6E6F0] pt-8">
        {/* Advanced AI Learning Recommendations */}
        <AdvancedRecommendationsSection recommendations={dashboardData.advanced_recommendations} />
      </div>
    </div>
  );
}






