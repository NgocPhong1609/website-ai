"use client";

import { useState, useEffect } from "react";
import { Button } from "@shared/components/ui";
import toast from "react-hot-toast";

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
 const [loading, setLoading] = useState(false);
 const [details, setDetails] = useState<ILessonDetails | null>(null);

 // Mỗi khi mở modal hoặc bấm sang bài học khác (lessonTitle thay đổi), tự động gọi lại API và hiển thị vòng xoay loading
 useEffect(() => {
 if (isOpen && lessonTitle) {
 const fetchLessonDetails = async () => {
 setLoading(true);
 setDetails(null); // Reset dữ liệu cũ ngay lập tức để hiện vòng tròn loading
 try {
 const res = await fetch("/api/student/analyze-lesson", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ lesson_title: lessonTitle, goal }),
 });
 const json = await res.json();
 if (json.status === "success") {
 setDetails(json.data);
 }
 } catch (err) {
 console.error(err);
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
 <div className="bg-white w-full max-w-4xl rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 relative my-8 animate-in fade-in zoom-in-95 duration-200">
 
 {/* Header */}
 <div className="flex justify-between items-start border-b pb-4">
 <div>
 <span className="text-xs font-bold text-[#C0392B] uppercase tracking-wider">AI Curriculum Analyst</span>
 <h2 className="text-2xl font-bold text-[#131B2E] mt-1">{lessonTitle}</h2>
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#8A8478] hover:bg-gray-200 transition-colors cursor-pointer"
 >
 
 </button>
 </div>

 {loading || !details ? (
 <div className="py-20 flex flex-col items-center justify-center gap-3">
 <div className="w-10 h-10 border-4 border-[#E8E2D9] border-t-transparent rounded-full animate-spin" />
 <p className="text-sm text-[#8A8478] font-medium">AI is analyzing & generating specific insights for &quot;{lessonTitle}&quot;...</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
 
 {/* Cột trái (7 phần): Phân tích chi tiết của AI độc lập theo bài học */}
 <div className="md:col-span-7 flex flex-col gap-5">
 <div>
 <h4 className="text-sm font-bold text-[#131B2E] mb-1.5 flex items-center gap-2">
 <span></span> Overview & Objective
 </h4>
 <p className="text-xs text-[#8A8478] leading-relaxed bg-[#FEFCF9] p-3.5 rounded-2xl border border-gray-100">
 {details.overview}
 </p>
 </div>

 <div>
 <h4 className="text-sm font-bold text-[#131B2E] mb-2.5 flex items-center gap-2">
 <span></span> Key Takeaways
 </h4>
 <ul className="flex flex-col gap-2">
 {details.key_takeaways?.map((point: string, idx: number) => (
 <li key={idx} className="text-xs text-[#4A4F5C] flex items-start gap-2.5 bg-[#F5F0E8] p-2.5 rounded-xl border border-[#E8E2D9]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] mt-1.5 shrink-0" />
 <span className="leading-relaxed">{point}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Cột phải (5 phần): Danh sách khóa học liên quan */}
 <div className="md:col-span-5 flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
 <h4 className="text-xs font-bold text-[#84849A] uppercase tracking-wider mb-1">
 Recommended Instructor Courses
 </h4>

 {details.recommended_courses?.map((course, idx) => (
 <div key={idx} className="bg-white border border-[#E8E2D9] rounded-2xl p-4 flex flex-col gap-2.5 hover:shadow-md transition-all hover:border-[#B8B0A3]">
 <div className="flex justify-between items-center">
 <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D4A574] text-white rounded-full">
 {course.badge || "Featured"}
 </span>
 <span className="text-xs font-bold text-[#C0392B]">{course.price || "$49.00"}</span>
 </div>

 <div>
 <h5 className="text-xs font-bold text-[#131B2E] leading-snug line-clamp-2">
 {course.title}
 </h5>
 <p className="text-[11px] text-[#8A8478] mt-1">Instructor: <span className="font-semibold text-gray-700">{course.instructor}</span></p>
 <div className="flex items-center gap-1">
 <span className="text-yellow-400">⭐</span>
 <p className="text-[11px] text-[#C0392B] font-medium mt-0.5">{course.rating}</p>
 </div>
 
 <Button 
 onClick={() => toast(`Chuyển hướng mua khóa học: ${course.title}`)}
 className="w-full mt-1 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
 >
 Course →
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
 className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
 >
 Close
 </Button>
 </div>

 </div>
 </div>
 );
}