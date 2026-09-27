"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { LessonAttachments } from "@/src/features/instructor/lesson-management/components/LessonAttachments";
import type { LessonData } from "./types";

// ─── Text/Article Renderer ────────────────────────────────────────────────────
export function ArticleRenderer({
 lesson,
 onComplete,
}: {
 lesson: LessonData;
 onComplete: () => void;
}) {
 const [timeSpent, setTimeSpent] = useState(0);
 const completedRef = useRef(false);
 const requiredTime = Math.ceil((lesson.durationSeconds || 60) * 1 / 3);

 useEffect(() => {
 completedRef.current = false;
 setTimeSpent(0);
 }, [lesson.id]);

 useEffect(() => {
 if (completedRef.current) return;

 const interval = setInterval(() => {
 // Only count time when the tab is visible
 if (document.visibilityState === 'visible') {
 setTimeSpent((prev) => {
 const next = prev + 1;
 if (next >= requiredTime && !completedRef.current) {
 completedRef.current = true;
 onComplete();
 }
 return next;
 });
 }
 }, 1000);

 return () => clearInterval(interval);
 }, [requiredTime, onComplete, lesson.id]);

 const progressPercent = Math.min((timeSpent / requiredTime) * 100, 100);

 if (!lesson.content) {
 return (
 <div className="w-full p-12 flex flex-col items-center justify-center text-slate-400 bg-blue-50/50 rounded-xl border border-blue-100">
 <BookOpen size={28} strokeWidth={1.75} aria-hidden />
 <span className="text-sm font-medium mt-3">Nội dung bài học chưa được cập nhật.</span>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-4">
 {/* Reading progress bar */}
 {!completedRef.current && (
 <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
 <BookOpen size={16} className="text-blue-500 shrink-0" aria-hidden />
 <div className="flex-1">
 <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
 <div
 className="h-full bg-blue-500 rounded-full transition-all duration-1000"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>
 <span className="text-[11px] font-semibold text-slate-500 shrink-0">
 {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')} / {Math.floor(requiredTime / 60)}:{String(requiredTime % 60).padStart(2, '0')}
 </span>
 </div>
 )}

 {/* CKEditor HTML Content — Styled Container */}
 <div
 className="ck-content prose prose-sm sm:prose max-w-none
 bg-white rounded-xl border border-blue-100 p-6 sm:p-8 shadow-sm
 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:mt-6
 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-5
 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-4
 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-slate-900 [&_h4]:mb-2
 [&_p]:text-[15px] [&_p]:text-slate-900 [&_p]:leading-relaxed [&_p]:mb-4
 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-slate-900
 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-slate-900
 [&_li]:mb-1.5 [&_li]:text-[15px] [&_li]:leading-relaxed
 [&_a]:text-slate-900 [&_a]:underline [&_a]:hover:text-blue-600
 [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-4
 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
 [&_th]:bg-slate-100 [&_th]:border [&_th]:border-blue-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-sm
 [&_td]:border [&_td]:border-blue-100 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
 [&_pre]:bg-[#1F2937] [&_pre]:text-slate-200 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4
 [&_code]:font-mono [&_code]:text-sm
 [&_hr]:border-blue-100 [&_hr]:my-6
 [&_figure]:my-4 [&_figure]:mx-auto
 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-slate-500 [&_figcaption]:mt-2
 [&_strong]:font-bold [&_em]:italic
 [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
 dangerouslySetInnerHTML={{ __html: lesson.content }}
 />
 {lesson.attachments && lesson.attachments.length > 0 && (
   <LessonAttachments
     lessonId={lesson.id}
     initialAttachments={lesson.attachments}
     readOnly
     audience="student"
   />
 )}
 </div>
 );
}
