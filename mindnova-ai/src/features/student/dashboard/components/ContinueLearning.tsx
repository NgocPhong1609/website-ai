import Link from "next/link";
import Image from "next/image";
import type { DashboardCourse } from "../types";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { GraduationCap } from "lucide-react";

function CourseCard({ course }: { course: DashboardCourse }) {
 const nextLessonTitle = course.next_lesson ?? course.nextLesson ?? "Tiếp tục bài học";
 const thumbnail = course.thumbnail_url ?? course.thumbnailUrl;
 const isAiPlan = String(course.id).startsWith("ai-custom-");
 const detailLink = isAiPlan ? "/study-plan" : "/courses/detail";
 const lessonLink = isAiPlan ? "/study-plan" : "/courses/lesson";

 return (
 <div className={`group/card bg-white border rounded-xl flex flex-col justify-between h-full transition-all duration-300 overflow-hidden relative ${
 isAiPlan 
 ? "border-blue-200 hover:border-blue-300"
 : "border-slate-100 hover:border-slate-200"
 }`}>
 {/* Compact Thumbnail Container */}
 <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
 {thumbnail ? (
 <Image
 src={thumbnail}
 alt={course.title}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.96] group-hover/card:brightness-100"
 />
 ) : (
 <div className={`w-full h-full ${isAiPlan ? "bg-slate-900" : "bg-slate-700"}`} />
 )}
 
 {/* Gentle veil */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
 
 {/* Progress badge */}
 <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-slate-900 border border-white/50 flex items-center gap-1.5 z-10">
 <span className="w-2 h-2 rounded-full bg-emerald-500" />
 <span>{course.progress}% hoàn thành</span>
 </div>

 {/* AI Badge */}
 {isAiPlan && (
 <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold border border-white/20 z-10 uppercase tracking-wider">
 AI Roadmap
 </div>
 )}
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-slate-100 h-1.5 overflow-hidden p-0 border-b border-slate-200">
 <div 
 className="h-full bg-blue-600 transition-all duration-700" 
 style={{ width: `${course.progress}%` }}
 />
 </div>

 {/* Content Body */}
 <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
 <div>
 <Link href={detailLink} className="block text-decoration-none focus:outline-none min-w-0 group/title">
 <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover/card:text-blue-600 group-hover/title:text-blue-600 transition-colors">
 {course.title}
 </h3>
 </Link>

 {/* Up Next tile */}
 <div className="mt-3 bg-slate-50 rounded-lg p-3 flex items-center gap-3 border border-slate-100 group-hover/card:border-slate-200 transition-all duration-200">
 <div className="w-8 h-8 rounded-lg bg-slate-100 text-blue-600 flex items-center justify-center shrink-0 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all duration-300 text-xs font-bold">
 N
 </div>
 <div className="min-w-0 flex-1">
 <span className="text-xs font-medium text-slate-500 block mb-0.5">Bài tiếp theo</span>
 <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{nextLessonTitle}</p>
 </div>
 </div>
 </div>

 <Link
 href={`/courses/lesson?courseId=${course.id}`}
 className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 mt-auto text-decoration-none"
 >
 <span>{isAiPlan ? "Xem lộ trình AI" : "Vào học tiếp"}</span>
 </Link>
 </div>
 </div>
 );
}

interface ContinueLearningProps {
 courses?: DashboardCourse[];
}

export function ContinueLearning({ courses = [] }: ContinueLearningProps) {
 const items = courses || [];

 if (items.length === 0) {
 return (
 <section aria-labelledby="continue-learning-heading" className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-1 h-6 rounded-full bg-blue-600" />
 <div>
 <h2
 id="continue-learning-heading"
 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900"
 >
 Tiếp tục học tập
 </h2>
 <p className="text-xs font-normal text-slate-500">Nhanh chóng quay lại các học phần bạn đang theo đuổi</p>
 </div>
 </div>
 
 <Link
 href="/explore"
 className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all text-decoration-none w-fit shrink-0"
 >
 <span>Khám phá khoá học</span>
 </Link>
 </div>

        <NoDataAvailable
          icon={GraduationCap}
          title="Bạn chưa bắt đầu khóa học nào"
          description="Hãy khám phá thư viện khóa học của chúng tôi và bắt đầu hành trình học tập của bạn ngay hôm nay."
          action={
            <Link
              href="/explore"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all text-decoration-none shadow-sm"
            >
              Tìm khóa học
            </Link>
          }
        />
 </section>
 );
 }

 return (
 <section aria-labelledby="continue-learning-heading" className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-1 h-6 rounded-full bg-blue-600" />
 <div>
 <h2
 id="continue-learning-heading"
 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900"
 >
 Tiếp tục học tập
 </h2>
 <p className="text-xs font-normal text-slate-500">Nhanh chóng quay lại các học phần bạn đang theo đuổi</p>
 </div>
 </div>
 
 <Link
 href="/explore"
 className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all text-decoration-none w-fit shrink-0"
 >
 <span>Xem tất cả khoá học</span>
 </Link>
 </div>

 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {courses.map((course, index) => (
 <CourseCard key={`${course.id}-${index}`} course={course} />
 ))}
 </div>
 </section>
 );
}
