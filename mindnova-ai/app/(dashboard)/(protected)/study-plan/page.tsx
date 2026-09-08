import { StudyPlanWorkspace } from "@/src/features/student/ai-study-plan";
import { getStudyPlanOverview } from "@/src/features/student/ai-study-plan/services/study-plan.service";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

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
 <section className="relative overflow-hidden rounded-2xl bg-white border border-border p-6 sm:p-8 shadow-sm w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-4 max-w-2xl">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-muted border border-red-100 text-xs font-semibold text-red-700">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-muted0"></span>
 </span>
 Lộ trình học AI • Module {currentIdx} / {totalMods}
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
 {activeSyllabus.title.split(" ")[0]} {" "}
 <span className="text-primary font-extrabold">
 {activeSyllabus.title.split(" ").slice(1).join(" ")}
 </span>
 </h1>

 <p className="text-sm text-muted-foreground leading-relaxed font-medium">
 {activeSyllabus.description}
 </p>
 </div>

 {/* Synchronized Universal Wide Mastery Card */}
 <div className="group shrink-0 bg-white rounded-2xl p-5 border border-border flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:shadow-md transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-3">
 <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
 Tiến độ lộ trình <ArrowUpRight className="w-3.5 h-3.5" />
 </span>
 <span className="text-[11px] font-bold text-stone-700 bg-secondary px-2.5 py-1 rounded-full border border-border">
 Đúng tiến độ
 </span>
 </div>

 <div className="text-3xl font-bold text-foreground my-1 flex items-baseline justify-between gap-6">
 <div>
 <span className="text-primary">{progressPct}%</span>
 <span className="text-xs font-medium text-muted-foreground ml-1.5">hoàn thành</span>
 </div>
 <span className="text-xs font-semibold text-muted-foreground">
 {completedTop} / {totalTop} chủ đề
 </span>
 </div>

 <div className="w-full h-2.5 bg-secondary rounded-full mt-3 overflow-hidden border border-border/50">
 <div
 className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
 style={{ width: `${progressPct}%` }}
 />
 </div>

 <p className="text-xs font-medium text-muted-foreground mt-4 flex items-center justify-between gap-4">
 <span>Tiếp tục giữ vững phong độ nhé!</span>
 <span className="text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
 Tiếp tục <ArrowUpRight className="w-3.5 h-3.5" />
 </span>
 </p>
 </div>
 </div>
 </section>
 ) : (
 <section className="relative overflow-hidden rounded-2xl bg-muted border border-border p-8 text-center shadow-sm">
 <h2 className="text-xl font-bold text-foreground mb-2">Chưa có Lộ trình học</h2>
 <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">Bạn cần đăng ký khóa học để hệ thống tạo Lộ trình AI cá nhân hóa dành riêng cho bạn.</p>
 <a href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm transition-colors hover:bg-primary-hover shadow-sm">
 Khám phá Khóa học <ArrowUpRight className="w-4 h-4" />
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
