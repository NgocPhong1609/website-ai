"use client";

import { getErrorMessage, readApiResponse } from "@/src/shared/lib/user-error";

import { useState, useEffect } from "react";
import { Button } from "@shared/components/ui";
import toast from "react-hot-toast";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { ArrowRight, Star } from "lucide-react";

interface LessonModalProps {
 lessonTitle: string;
 goal: string;
 isOpen: boolean;
 onClose: () => void;
}

interface ICourse {
 title?: string;
 instructor?: string;
 rating?: string;
 price?: string;
 badge?: string;
}

interface ILessonDetails {
 overview?: string;
 key_takeaways?: string[];
 recommended_courses?: ICourse[];
}

export function LessonDetailModal({ lessonTitle, goal, isOpen, onClose }: LessonModalProps) {
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [details, setDetails] = useState<ILessonDetails | null>(null);

 // Mỗi khi mở modal hoặc bấm sang bài học khác (lessonTitle thay đổi), tự động gọi lại API và hiển thị vòng xoay loading
 useEffect(() => {
 if (isOpen && lessonTitle) {
 const fetchLessonDetails = async () => {
 setLoading(true);
 setError(null);
 setDetails(null); // Reset dữ liệu cũ ngay lập tức để hiện vòng tròn loading
 try {
 const res = await fetch("/api/student/analyze-lesson", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ lesson_title: lessonTitle, goal }),
 });
 const json = await readApiResponse(res, "Không thể tải nội dung bài học. Vui lòng thử lại.");
 if (json.status === "success") {
 setDetails(json.data);
 } else {
 throw new Error(getErrorMessage(json, "Không thể tải nội dung bài học. Vui lòng thử lại."));
 }
 } catch (err) {
 console.error(err);
 setError(getErrorMessage(err, "Không thể tải nội dung bài học. Vui lòng đóng và mở lại bài học để thử lại."));
 } finally {
 setLoading(false);
 }
 };

 fetchLessonDetails();
 }
 }, [isOpen, lessonTitle, goal]);

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
 <div className="bg-white w-full max-w-4xl rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 relative my-8 animate-in fade-in zoom-in-95 duration-200">
 
 {/* Header */}
 <div className="flex justify-between items-start border-b pb-4">
 <div>
 <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Phân tích giáo trình AI</span>
 <h2 className="text-2xl font-bold text-slate-900 mt-1">{lessonTitle}</h2>
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
 >
 
 </button>
 </div>

 {error ? <p role="alert" className="text-sm text-rose-700">{error}</p> : loading || !details ? (
 <div role="status" aria-busy="true" className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
 <span className="sr-only">AI đang phân tích bài &quot;{lessonTitle}&quot;</span>
 <div className="md:col-span-7 space-y-3">
 <Skeleton className="h-5 w-1/2" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-5/6" />
 <Skeleton className="h-4 w-2/3" />
 </div>
 <div className="md:col-span-5 space-y-3">
 <Skeleton className="h-20 w-full" />
 <Skeleton className="h-20 w-full" />
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
 
 {/* Cột trái (7 phần): Phân tích chi tiết của AI độc lập theo bài học */}
 <div className="md:col-span-7 flex flex-col gap-5">
 <div>
 <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
 <span></span> Tổng quan & mục tiêu
 </h4>
 <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
 {details.overview}
 </p>
 </div>

 <div>
 <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
 <span></span> Kiến thức chính
 </h4>
 <ul className="flex flex-col gap-2">
 {details.key_takeaways?.map((point: string, idx: number) => (
 <li key={idx} className="text-xs text-slate-500 flex items-start gap-2.5 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
 <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] mt-1.5 shrink-0" />
 <span className="leading-relaxed">{point}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Cột phải (5 phần): Danh sách khóa học liên quan */}
 <div className="md:col-span-5 flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
 Khóa học gợi ý từ giảng viên
 </h4>

 {details.recommended_courses?.map((course, idx) => (
 <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2.5 hover:shadow-md transition-all hover:border-slate-400">
 <div className="flex justify-between items-center">
 <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D4A574] text-white rounded-full">
 {course.badge || "Featured"}
 </span>
 <span className="text-xs font-bold text-blue-500">{course.price || "$49.00"}</span>
 </div>

 <div>
 <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
 {course.title}
 </h5>
 <p className="text-[11px] text-slate-500 mt-1">Instructor: <span className="font-semibold text-slate-700">{course.instructor}</span></p>
 <div className="flex items-center gap-1">
 <Star size={14} className="fill-yellow-400 text-yellow-400" aria-hidden />
 <p className="text-[11px] text-blue-500 font-medium mt-0.5">{course.rating}</p>
 </div>
 
 <Button 
 onClick={() => toast(`Chuyển hướng mua khóa học: ${course.title}`)}
 className="w-full mt-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
 >
 Khóa học<ArrowRight className="inline h-4 w-4 ml-1 align-text-bottom" aria-hidden />
 </Button>
 </div>
 </div>
 ))}
 </div>

 </div>
 )}

 {/* Footer */}
 <div className="border-t pt-4 flex justify-end">
 <Button 
 onClick={onClose}
 className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
 >
 Close
 </Button>
 </div>

 </div>
 </div>
 );
}