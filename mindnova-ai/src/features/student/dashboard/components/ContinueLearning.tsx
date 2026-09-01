import Link from "next/link";
import Image from "next/image";
import type { DashboardCourse } from "../types";

function CourseCard({ course }: { course: DashboardCourse }) {
 const nextLessonTitle = course.next_lesson ?? course.nextLesson ?? "Tiếp tục bài học";
 const thumbnail = course.thumbnail_url ?? course.thumbnailUrl;
 const isAiPlan = String(course.id).startsWith("ai-custom-");
 const detailLink = isAiPlan ? "/study-plan" : "/courses/detail";
 const lessonLink = isAiPlan ? "/study-plan" : "/courses/lesson";

 return (
 <div className={`group/card bg-white border rounded-xl flex flex-col justify-between h-full transition-all duration-300 overflow-hidden relative ${
 isAiPlan 
 ? "border-[#D4A574]/50 hover:border-[#D4A574]"
 : "border-[#E8E2D9] hover:border-[#B8B0A3]"
 }`}>
 {/* Compact Thumbnail Container */}
 <div className="relative h-44 w-full bg-[#2C3039] overflow-hidden shrink-0">
 {thumbnail ? (
 <Image
 src={thumbnail}
 alt={course.title}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.96] group-hover/card:brightness-100"
 />
 ) : (
 <div className={`w-full h-full ${isAiPlan ? "bg-[#2C3039]" : "bg-[#4A4F5C]"}`} />
 )}
 
 {/* Gentle veil */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
 
 {/* Progress badge */}
 <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-[#2C3039] border border-white/50 flex items-center gap-1.5 z-10">
 <span className="w-2 h-2 rounded-full bg-[#27AE60]" />
 <span>{course.progress}% hoàn thành</span>
 </div>

 {/* AI Badge */}
 {isAiPlan && (
 <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#2C3039] text-white text-[10px] font-bold border border-white/20 z-10 uppercase tracking-wider">
 AI Roadmap
 </div>
 )}
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-[#F5F0E8] h-1.5 overflow-hidden p-0 border-b border-[#E8E2D9]">
 <div 
 className="h-full bg-[#2C3039] transition-all duration-700" 
 style={{ width: `${course.progress}%` }}
 />
 </div>

 {/* Content Body */}
 <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
 <div>
 <Link href={detailLink} className="block text-decoration-none focus:outline-none min-w-0 group/title">
 <h3 className="text-base sm:text-lg font-bold text-[#2C3039] leading-snug line-clamp-1 group-hover/card:text-[#C0392B] group-hover/title:text-[#C0392B] transition-colors font-[family-name:var(--font-playfair-display)]">
 {course.title}
 </h3>
 </Link>

 {/* Up Next tile */}
 <div className="mt-3 bg-[#FAF7F2] rounded-lg p-3 flex items-center gap-3 border border-[#E8E2D9] group-hover/card:border-[#B8B0A3] transition-all duration-200">
 <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] text-[#C0392B] flex items-center justify-center shrink-0 group-hover/card:bg-[#C0392B] group-hover/card:text-white transition-all duration-300 text-xs font-bold">
 N
 </div>
 <div className="min-w-0 flex-1">
 <span className="text-xs font-medium text-[#B8B0A3] block mb-0.5">Bài tiếp theo</span>
 <p className="text-xs sm:text-sm font-semibold text-[#2C3039] truncate">{nextLessonTitle}</p>
 </div>
 </div>
 </div>

 <Link
 href={`/courses/lesson?courseId=${course.id}`}
 className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-[#C0392B] bg-[#FADBD8]/50 hover:bg-[#C0392B] hover:text-white border border-[#C0392B]/20 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 mt-auto text-decoration-none"
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
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E2D9] pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-1 h-6 rounded-full bg-[#C0392B]" />
 <div>
 <h2
 id="continue-learning-heading"
 className="text-lg sm:text-xl font-bold tracking-tight text-[#2C3039] font-[family-name:var(--font-playfair-display)]"
 >
 Tiếp tục học tập
 </h2>
 <p className="text-xs font-normal text-[#8A8478]">Nhanh chóng quay lại các học phần bạn đang theo đuổi</p>
 </div>
 </div>
 
 <Link
 href="/explore"
 className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-[#C0392B] bg-[#FADBD8]/50 hover:bg-[#FADBD8] border border-[#C0392B]/20 transition-all text-decoration-none w-fit shrink-0"
 >
 <span>Khám phá khoá học</span>
 </Link>
 </div>

 <div className="w-full bg-white border border-[#E8E2D9] rounded-xl p-8 flex flex-col items-center justify-center text-center">
 <h3 className="text-lg font-bold text-[#2C3039] mb-2 font-[family-name:var(--font-playfair-display)]">Bạn chưa bắt đầu khóa học nào</h3>
 <p className="text-sm text-[#8A8478] max-w-md mb-6">Hãy khám phá thư viện khóa học của chúng tôi và bắt đầu hành trình học tập của bạn ngay hôm nay.</p>
 <Link
 href="/explore"
 className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] transition-all text-decoration-none"
 >
 Tìm khóa học
 </Link>
 </div>
 </section>
 );
 }

 return (
 <section aria-labelledby="continue-learning-heading" className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E2D9] pb-3">
 <div className="flex items-center gap-2.5">
 <div className="w-1 h-6 rounded-full bg-[#C0392B]" />
 <div>
 <h2
 id="continue-learning-heading"
 className="text-lg sm:text-xl font-bold tracking-tight text-[#2C3039] font-[family-name:var(--font-playfair-display)]"
 >
 Tiếp tục học tập
 </h2>
 <p className="text-xs font-normal text-[#8A8478]">Nhanh chóng quay lại các học phần bạn đang theo đuổi</p>
 </div>
 </div>
 
 <Link
 href="/explore"
 className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-[#C0392B] bg-[#FADBD8]/50 hover:bg-[#FADBD8] border border-[#C0392B]/20 transition-all text-decoration-none w-fit shrink-0"
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
