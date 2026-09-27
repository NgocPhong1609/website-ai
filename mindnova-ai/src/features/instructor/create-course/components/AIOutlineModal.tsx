"use client";

import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGenerateOutline, OutlineChapter, OutlineLesson, GeneratedOutline } from "../hooks/useGenerateOutline";
import { CheckCircle, PlayCircle, Sparkles, ArrowLeft, X } from "lucide-react";

export interface AIOutlineModalProps {

 isOpen: boolean;
 onClose: () => void;
 onApply?: (outline: GeneratedOutline) => void;
}

type WizardStep = "params" | "preview";
type GenerationState = "idle" | "loading" | "done" | "error";

export function AIOutlineModal({ isOpen, onClose, onApply }: AIOutlineModalProps) {
 const [step, setStep] = useState<WizardStep>("params");
 const [genState, setGenState] = useState<GenerationState>("idle");

 // Step 1: Course Parameters (Section 2.1)
 const [topic, setTopic] = useState("Fullstack Next.js & Serverless Architectures");
 const [targetAudience, setTargetAudience] = useState("Intermediate Web Developers & Bootcamp Graduates");
 const [skillLevel, setSkillLevel] = useState("Intermediate to Advanced");
 const [methodology, setMethodology] = useState("80/20 Practical Application vs Theoretical Concepts");

 // Step 2: Generated Skeleton Tree
 const [outline, setOutline] = useState<GeneratedOutline>({ chapters: [] });
 const [editingChapterIdx, setEditingChapterIdx] = useState<number | null>(null);

 const { generate, isGenerating, error } = useGenerateOutline();

 const handleGenerate = useCallback(async () => {
 if (!topic.trim() || isGenerating) return;
 setStep("preview");

 const result = await generate({ topic, targetAudience, skillLevel, methodology });
 if (result) {
 setOutline(result);
 }
 }, [topic, targetAudience, skillLevel, methodology, generate, isGenerating]);

 const handleApply = () => {
 if (onApply && outline.chapters.length > 0) {
 onApply(outline);
 }
 onClose();
 };

 const updateLessonTitle = (cIdx: number, lIdx: number, newTitle: string) => {
 const updated = { ...outline };
 updated.chapters[cIdx].lessons[lIdx] = { ...updated.chapters[cIdx].lessons[lIdx], title: newTitle };
 setOutline(updated);
 };

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
 <div className="bg-white rounded-lg border border-slate-200 shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm">
 <Sparkles size={20} className="text-emerald-600" />
 </span>
 <div>
 <h3 className="text-base font-semibold text-slate-900">Trợ lý AI tạo Đề cương (Mục 2.1)</h3>
 <p className="text-sm font-medium text-slate-500 mt-0.5">Xây dựng cấu trúc chương trình học chuẩn mực dựa trên thực tiễn tốt nhất.</p>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="text-slate-400 hover:text-slate-700 font-bold text-lg p-2 transition-colors rounded-lg border border-transparent hover:border-slate-200"
 >
 <X className="h-5 w-5" aria-hidden />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
 {step === "params" ? (
 <div className="flex flex-col gap-5 animate-fadeIn">
 <div>
 <label className="block text-sm font-semibold text-slate-900 mb-1.5">
 Chủ đề Khóa học &amp; Lĩnh vực
 </label>
 <input
 type="text"
 value={topic}
 onChange={(e) => setTopic(e.target.value)}
 className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-900 mb-1.5">
 Đối tượng Mục tiêu
 </label>
 <input
 type="text"
 value={targetAudience}
 onChange={(e) => setTargetAudience(e.target.value)}
 className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-900 mb-1.5">
 Trình độ Mục tiêu
 </label>
 <select
 value={skillLevel}
 onChange={(e) => setSkillLevel(e.target.value)}
 className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-blue-500 shadow-sm"
 >
 <option value="Beginner">Người mới bắt đầu (Cơ bản)</option>
 <option value="Intermediate to Advanced">Trung bình đến Cao cấp</option>
 <option value="Executive Mastery">Chuyên gia</option>
 </select>
 </div>
 </div>

 {/* Teaching Methodology Selection */}
 <div>
 <label className="block text-sm font-semibold text-slate-900 mb-2">
 Phương pháp Giảng dạy (Chiến lược Cấu trúc)
 </label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button
 type="button"
 onClick={() => setMethodology("80/20 Practical Application vs Theoretical Concepts")}
 className={twMerge(
 "p-4 rounded-lg border text-left transition-all",
 methodology.includes("80/20")
 ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
 : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
 )}
 >
 <p className="text-sm font-semibold"> 80/20 Thực hành vs Lý thuyết (Khuyên dùng)</p>
 <p className="text-xs font-medium text-slate-500 mt-1">
 Chương trình chú trọng dự án; 80% thời gian thực hành &amp; làm bài tập, 20% lý thuyết nền tảng.
 </p>
 </button>

 <button
 type="button"
 onClick={() => setMethodology("Theoretical Deep-Dive & Academic Analysis")}
 className={twMerge(
 "p-4 rounded-lg border text-left transition-all",
 !methodology.includes("80/20")
 ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
 : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
 )}
 >
 <p className="text-sm font-semibold">Nắm vững Học thuật Toàn diện</p>
 <p className="text-xs font-medium text-slate-500 mt-1">
 Đi sâu vào lý thuyết, nghiên cứu các tình huống thực tế và phân tích kiến thức chuyên sâu.
 </p>
 </button>
 </div>
 </div>
 </div>
 ) : (
 /* Step 2: Skeleton Tree Preview & Edit */
 <div className="flex flex-col gap-6 animate-fadeIn">
 {isGenerating ? (
 <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
 <Loader size="md" />
 <h4 className="text-sm font-semibold text-slate-900">Đang tạo đề cương khóa học bằng AI...</h4>
 <p className="text-xs text-slate-500 max-w-sm">
 Đang cấu trúc các chương dựa trên phương pháp bạn đã chọn.
 </p>
 </div>
 ) : error ? (
 <div className="py-20 flex flex-col items-center justify-center gap-4 text-center text-blue-500">
 <h4 className="text-sm font-semibold">{error}</h4>
 <button disabled={isGenerating} onClick={handleGenerate} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 disabled:opacity-50">
 Thử lại
 </button>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-900 px-3 py-1 bg-emerald-50 rounded-lg border border-slate-200">
 Đã tạo Đề cương bằng AI
 </span>
 <button
 type="button"
 onClick={() => setStep("params")}
 className="text-xs font-bold text-blue-500 hover:underline"
 >
 <ArrowLeft className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Thay đổi thông số
 </button>
 </div>

 <p className="text-xs text-slate-500 font-semibold">
 Xem lại và chỉnh sửa tiêu đề các chương, bài học đã tạo trước khi áp dụng vào chương trình chính.
 </p>

 <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2">
 {outline.chapters.map((ch, cIdx) => (
 <div key={cIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <h5 className="text-sm font-semibold text-slate-900">
 {cIdx + 1}. {ch.title}
 </h5>
 <span className="text-xs font-medium text-slate-500">{ch.lessons.length} Bài học</span>
 </div>

 <ul className="flex flex-col gap-2">
 {ch.lessons.map((lesson, lIdx) => (
 <li key={lIdx} className={twMerge(
 "flex flex-col gap-1.5 p-2.5 rounded-lg border shadow-sm",
 lesson.type === "quiz"
 ? "bg-slate-50 border-slate-200"
 : "bg-white border-slate-200"
 )}>
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium">
 {lesson.type === "quiz" ? "" : ""}
 </span>
 <input
 type="text"
 value={lesson.title}
 onChange={(e) => updateLessonTitle(cIdx, lIdx, e.target.value)}
 className="flex-1 text-sm font-medium text-slate-900 bg-transparent focus:outline-none focus:text-blue-500"
 />
 <span className={twMerge(
 "text-xs font-medium px-2 py-0.5 rounded-md shrink-0 border",
 lesson.type === "quiz"
 ? "bg-slate-50 border-slate-200 text-slate-600"
 : "bg-blue-50 border-blue-100 text-blue-700"
 )}>
 {lesson.type === "quiz" ? "Trắc nghiệm" : "Tài liệu"}
 </span>
 </div>
 {/* Preview nội dung */}
 {lesson.type === "document" && lesson.content && (
 <p className="text-[11px] text-slate-400 font-medium ml-6 line-clamp-2">
 Đã có nội dung ({lesson.content.replace(/<[^>]*>/g, '').slice(0, 80)}...)
 </p>
 )}
 {lesson.type === "quiz" && lesson.questions && lesson.questions.length > 0 && (
 <p className="text-[11px] text-amber-600 font-medium ml-6">
 {lesson.questions.length} câu hỏi trắc nghiệm đã sẵn sàng
 </p>
 )}
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
 >
 Hủy bỏ
 </button>

 {step === "params" ? (
 <button
 type="button"
 onClick={handleGenerate}
 className="px-6 py-2.5 bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md hover:opacity-95 transition-all flex items-center gap-2"
 >
 <span><Sparkles className="inline h-4 w-4 mr-1.5 align-text-bottom" aria-hidden />Tạo Đề cương</span>
 </button>
 ) : (
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={handleGenerate}
 disabled={isGenerating}
 className="px-4 py-2 bg-white border border-blue-100 text-blue-500 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
 >
 Tạo lại
 </button>
 <button
 type="button"
 onClick={handleApply}
 disabled={isGenerating || outline.chapters.length === 0}
 className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all disabled:opacity-50"
 >
 Áp dụng vào Khóa học
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}