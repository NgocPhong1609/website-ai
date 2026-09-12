"use client";

import { useGetDashboardOverview } from "../../api";

export function DashboardContent() {
 const { data: dashboardData, isLoading, error } = useGetDashboardOverview();

 if (isLoading) return <div className="p-8 text-center text-[#94A3B8]">Đang tải dữ liệu bảng điều khiển...</div>;
 if (error) return <div className="p-8 text-center text-[#3B82F6]">Có lỗi xảy ra khi tải dữ liệu.</div>;

 const user = dashboardData?.user;
 const streak = dashboardData?.study_streak?.days || 0;
 const overallProgress = dashboardData?.overall_progress?.percent || 0;
 const progressDelta = dashboardData?.overall_progress?.delta || '';
 const focusAreas = dashboardData?.focus_areas || [];
 const aiSuggestion = dashboardData?.ai_suggestion;

 return (
 <div className="flex-1 overflow-y-auto bg-[#F8FAFC] min-h-full">
 <div className="max-w-[1100px] mx-auto p-6 lg:p-8 pb-20">
 
 {/* ─── Banner ────────────────────────────────────────────────────────────── */}
 <div className="bg-[#F8FAFC] rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden border border-[#E2E8F0]">
 <div className="relative z-10">
 <h1 className="text-[28px] md:text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight font-serif">
 Tuyệt vời quá, {user?.name || "Học viên"}!
 </h1>
 <p className="text-[15px] text-[#64748B] mt-2 font-medium leading-relaxed">
 Bạn đang làm rất tốt. Hãy tiếp tục duy trì chuỗi học tập nhé!
 </p>
 </div>
 
 <div className="relative z-10 mt-6 md:mt-0">
 <div className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center gap-2 cursor-default">
 {streak} Ngày liên tiếp!
 </div>
 </div>
 </div>

 {/* ─── Main Grid ─────────────────────────────────────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
 
 {/* Left Column (Wider) */}
 <div className="lg:col-span-2 flex flex-col gap-6">
 
 {/* Smart Next Step */}
 <div className="bg-white rounded-2xl p-6 lg:p-8 relative border border-[#E2E8F0]">
 
 <div className="absolute top-6 right-6 bg-[#EFF6FF] text-[#3B82F6] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
 MindNova AI Suggestion
 </div>

 <div className="flex flex-col md:flex-row gap-6 items-start mt-8 md:mt-0">
 <div className="w-16 h-16 bg-[#0F172A] rounded-xl flex items-center justify-center text-white shrink-0">
 <span className="text-lg font-bold font-serif">AI</span>
 </div>
 
 <div className="flex-1">
 <h3 className="font-bold text-[22px] text-[#0F172A] leading-tight font-serif">Bước tiếp theo</h3>
 <p className="text-[15px] text-[#64748B] mt-2 leading-relaxed max-w-lg">
 {aiSuggestion?.message || "Hãy bắt đầu một khóa học mới để phát triển kỹ năng của bạn ngay hôm nay!"}
 </p>
 <button className="mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-lg font-bold text-[14px] flex items-center gap-2 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
 Tiếp tục học
 </button>
 </div>
 </div>
 </div>

 {/* Stats Row */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Overall Progress */}
 <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] flex flex-col justify-between">
 <div className="flex justify-between items-start">
 <h4 className="text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase">Tiến độ chung</h4>
 <span className="text-[#3B82F6] font-bold text-[14px]">{progressDelta}</span>
 </div>
 
 <div className="mt-6 mb-8">
 <div className="flex items-baseline gap-2">
 <span className="text-[56px] font-bold text-[#0F172A] leading-none tracking-tighter font-serif">{overallProgress}%</span>
 <span className="text-[13px] font-semibold text-[#94A3B8]">Hoàn thành</span>
 </div>
 </div>

 <div>
 <p className="text-[12px] font-medium text-[#64748B] mb-2">So với phiên học trước</p>
 <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
 <div className={`h-full bg-[#0F172A] rounded-full transition-all duration-700`} style={{ width: `${overallProgress}%` }}></div>
 </div>
 </div>
 </div>

 {/* Recent Activity */}
 <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
 <h4 className="text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase mb-6">Recent Activity</h4>
 
 <div className="flex flex-col gap-6">
 {/* Item 1 */}
 <div className="flex gap-4">
 <div className="w-10 h-10 rounded-full bg-[#E8F6F3] text-[#0F172A] flex items-center justify-center shrink-0 text-sm font-bold">
 Q
 </div>
 <div>
 <p className="font-bold text-[14px] text-[#0F172A]">Just now</p>
 <p className="text-[13px] text-[#64748B] mt-0.5">Completed Quiz: Route Handlers</p>
 <div className="bg-[#F1F5F9] text-[#0F172A] text-[11px] font-bold px-2.5 py-0.5 rounded-md mt-2 w-fit">
 Score: 75/100
 </div>
 </div>
 </div>

 {/* Item 2 */}
 <div className="flex gap-4">
 <div className="w-10 h-10 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0 text-sm font-bold">
 V
 </div>
 <div>
 <p className="font-bold text-[14px] text-[#0F172A]">Yesterday</p>
 <p className="text-[13px] text-[#64748B] mt-0.5">Watched &apos;Dynamic Routing&apos; (12m)</p>
 </div>
 </div>
 </div>
 </div>

 </div>
 </div>

 {/* Right Column (Narrower) */}
 <div className="lg:col-span-1 flex flex-col gap-6">
 
 {/* Focus Areas */}
 <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
 <div className="flex items-center gap-2 mb-2">
 <h3 className="font-bold text-[18px] text-[#0F172A] font-serif">Focus Areas</h3>
 </div>
 <p className="text-[13px] text-[#64748B] mb-6 leading-relaxed">
 AI detected these topics need more attention:
 </p>

 <div className="flex flex-col gap-3">
 {/* Alert Area */}
 <div className="bg-[#EFF6FF]/50 border border-[#3B82F6]/20 rounded-xl p-4">
 <div className="flex justify-between items-center mb-1.5">
 <h4 className="font-bold text-[14px] text-[#3B82F6]">Error Handling</h4>
 <span className="bg-[#3B82F6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
 Needs Practice
 </span>
 </div>
 <p className="text-[12px] text-[#2563EB] leading-relaxed">
 Missed 2 questions in the last quiz. Review error boundaries.
 </p>
 </div>

 {/* Normal Area */}
 <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
 <div className="flex justify-between items-center mb-1.5">
 <h4 className="font-bold text-[14px] text-[#0F172A]">Middleware Logic</h4>
 <span className="text-[11px] font-semibold text-[#94A3B8]">
 Low Mastery
 </span>
 </div>
 <p className="text-[12px] text-[#64748B] leading-relaxed">
 Last practiced 4 days ago. Needs refresh.
 </p>
 </div>
 </div>

 <button className="w-full mt-6 py-3 rounded-lg border-2 border-[#E2E8F0] text-[#0F172A] font-bold text-[14px] hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E2E8F0]">
 Personalized Practice
 </button>
 </div>

 {/* Badges Earned */}
 <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
 <h4 className="text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase mb-5">Badges Earned</h4>
 
 <div className="flex gap-4">
 {/* Badge 1 */}
 <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer text-sm font-bold font-serif">
 1st
 </div>
 
 {/* Badge 2 */}
 <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer text-sm font-bold font-serif">
 Top
 </div>

 {/* Badge 3 (Locked) */}
 <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] text-xs font-medium">
 ?
 </div>
 </div>
 </div>

 </div>
 </div>

 </div>
 </div>
 );
}
