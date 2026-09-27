import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
 if (dashboardData.error) {
 return (
 <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
 <h1 className="text-xl font-bold text-slate-900 mb-2">Không thể tải bảng điều khiển</h1>
 <p className="text-sm text-slate-500 max-w-md mb-6">{dashboardData.error}</p>
 <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Thử lại</Link>
 </div>
 );
 }
 const userName = dashboardData.user?.name ?? "Học viên";

 return (
 <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1400px] w-full mx-auto min-h-[calc(100vh-4rem)]">
 
 {/* ─── Synchronized Universal Welcome Hero Banner ─── */}
 <section className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm transition-all w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
 <div className="space-y-4 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-xs font-medium text-blue-600">
 {dashboardData.ai_badge_text || "MindNova AI • Hoạt động 24/7"}
 </div>
 
 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
 {dashboardData.user ? (
 <>Xin chào, <span className="text-blue-600">{userName}!</span></>
 ) : (
 <>Chào mừng đến với <span className="text-blue-600">MindNova AI</span></>
 )}
 </h1>
 
 <p className="text-sm text-slate-500 leading-relaxed">
 {dashboardData.user 
 ? (dashboardData.welcome_message || "Theo dõi tiến độ học tập và gợi ý từ gia sư AI.")
 : "Vui lòng đăng nhập để theo dõi tiến độ học tập và nhận các gợi ý thông minh từ AI."}
 </p>
 </div>

 {/* Universal Wide Mastery Card */}
 {dashboardData.user ? (
 <Link href="/study-plan" className="group block shrink-0 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] hover:border-blue-500 hover:shadow-md transition-all text-decoration-none focus:outline-none">
 <div className="w-full flex items-center justify-between gap-4 mb-3">
 <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors inline-flex items-center gap-1">Mục tiêu trong ngày <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></span>
 <span className="text-[11px] font-medium text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
 {dashboardData.daily_goal?.percentage === 100 ? "Hoàn thành" : (dashboardData.daily_goal?.completed ? "Đang tiến hành" : "Chưa bắt đầu")}
 </span>
 </div>
 
 <div className="text-3xl font-bold text-slate-900 my-1 flex items-baseline justify-between gap-6">
 <div>
 <span className="text-blue-600">{dashboardData.daily_goal?.percentage || 0}%</span>
 <span className="text-xs font-medium text-slate-500 ml-1.5">hoàn thành</span>
 </div>
 <span className="text-xs font-medium text-slate-500">
 {dashboardData.daily_goal?.completed || 0} / {dashboardData.daily_goal?.target || 0} bài học
 </span>
 </div>

 <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
 <div 
 className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
 style={{ width: `${dashboardData.daily_goal?.percentage || 0}%` }}
 />
 </div>
 
 <p className="text-xs font-medium text-slate-500 mt-4 flex items-center justify-between gap-4">
 <span>{dashboardData.daily_goal?.percentage === 100 ? "Bạn đã đạt mục tiêu hôm nay!" : (dashboardData.daily_goal?.completed ? "Tiếp tục cố gắng nhé!" : "Hoàn thành bài học đầu tiên hôm nay.")}</span>
 <span className="text-blue-600 font-semibold group-hover:underline">Vào học tiếp</span>
 </p>
 </Link>
 ) : (
 <div className="group block shrink-0 bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] text-center">
 <h3 className="text-sm font-semibold text-slate-900 mb-1">Dữ liệu được bảo mật</h3>
 <p className="text-xs text-slate-500 mb-4">Đăng nhập để xem thông tin học tập của bạn.</p>
 <Link href="/login" className="inline-flex justify-center items-center py-2 px-4 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
 Đăng nhập ngay
 </Link>
 </div>
 )}
 </div>
 </section>

 {dashboardData.user ? (
 <>
 {/* ─── Top Stats Section: Compact modular stat cards ─── */}
 <DashboardStatsPanel 
 overallProgress={dashboardData.overall_progress} 
 studyStreak={dashboardData.study_streak} 
 focusAreas={dashboardData.focus_areas}
 weeklyActivity={dashboardData.weekly_activity}
 checkedInDates={dashboardData.checked_in_dates || []}
 streakFreezeCount={(dashboardData.study_streak as { freeze_count?: number })?.freeze_count || 0}
 />

 {/* ─── AI Co-Pilot Suggestion Box ─── */}
 <AiSuggestionCard suggestion={dashboardData.ai_suggestion} />

 {/* ─── Continue Learning Courses Grid ─── */}
 <ContinueLearning courses={dashboardData.courses} />

 {/* ─── Advanced Recommendations Section ─── */}
 <div className="w-full flex flex-col gap-8 border-t border-slate-200 pt-8">
 <AdvancedRecommendationsSection recommendations={dashboardData.advanced_recommendations} />
 </div>
 </>
 ) : (
 <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-white">
 <h2 className="text-xl font-semibold text-slate-900 mb-2">Bắt đầu hành trình học tập của bạn</h2>
 <p className="text-sm text-slate-500 max-w-md mb-6">
 Khám phá các khóa học từ giảng viên và đăng nhập để lưu tiến độ, nhận gợi ý từ Trợ lý AI Nova.
 </p>
 <Link 
 href="/explore" 
 className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
 >
 Tìm khóa học ngay 
 </Link>
 </div>
 )}
 </div>
 );
}
