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
 
 {/* ─── Synchronized Universal Welcome Hero Banner ─── */}
 <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 shadow-sm transition-all w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
 <div className="space-y-4 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-xs font-medium text-blue-600">
 {dashboardData.ai_badge_text || "MindNova AI • Hoạt động 24/7"}
 </div>
 
 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
 Chào mừng trở lại, <span className="text-blue-600">{userName}!</span>
 </h1>
 
 <p className="text-sm text-slate-500 leading-relaxed">
 {dashboardData.user 
 ? (dashboardData.welcome_message || "Chuỗi chuyên cần của bạn đang được duy trì vô cùng tích cực! Hiện tại bạn đạt hiệu suất rèn luyện vượt trội hơn 88% học viên cùng chuyên ngành trong tuần này.")
 : "Vui lòng đăng nhập để theo dõi tiến độ học tập và nhận các gợi ý thông minh từ AI."}
 </p>
 </div>

 {/* Universal Wide Mastery Card */}
 {dashboardData.user ? (
 <Link href="/study-plan" className="group block shrink-0 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] hover:border-slate-200 hover:shadow-sm transition-all text-decoration-none focus:outline-none">
 <div className="w-full flex items-center justify-between gap-4 mb-3">
 <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">Mục tiêu trong ngày ↗</span>
 <span className="text-[11px] font-medium text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
 {dashboardData.daily_goal?.percentage === 100 ? "Hoàn thành" : "Đang tiến hành"}
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
 <span>{dashboardData.daily_goal?.percentage === 100 ? "Bạn đã đạt mục tiêu hôm nay!" : "Tiếp tục cố gắng nhé!"}</span>
 <span className="text-blue-600 font-semibold group-hover:underline">Vào học tiếp</span>
 </p>
 </Link>
 ) : (
 <div className="group block shrink-0 bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] text-center">
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
 checkedInDates={(dashboardData as any).checked_in_dates || []}
 streakFreezeCount={(dashboardData.study_streak as any)?.freeze_count || 1}
 />

 {/* ─── AI Co-Pilot Suggestion Box ─── */}
 <AiSuggestionCard suggestion={dashboardData.ai_suggestion} />

 {/* ─── Continue Learning Courses Grid ─── */}
 <ContinueLearning courses={dashboardData.courses} />

 {/* ─── Advanced Recommendations Section ─── */}
 <div className="w-full flex flex-col gap-8 border-t border-slate-100 pt-8">
 <AdvancedRecommendationsSection recommendations={dashboardData.advanced_recommendations} />
 </div>
 </>
 ) : (
 <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
 <h2 className="text-xl font-semibold text-slate-900 mb-2">Bạn chưa bắt đầu khóa học nào</h2>
 <p className="text-sm text-slate-500 max-w-md mb-6">
 Khám phá hàng trăm khóa học chất lượng từ chuyên gia và xây dựng lộ trình học tập của riêng bạn ngay hôm nay.
 </p>
 <Link 
 href="/explore" 
 className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
 >
 Tìm khóa học ngay 
 </Link>
 </div>
 )}
 </div>
 );
}
