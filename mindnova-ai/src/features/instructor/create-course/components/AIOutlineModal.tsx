"use client";

import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Loader } from "@/src/shared/components/ui/Loader";
import { SparklesIcon, CheckCircleIcon, PlayCircleIcon } from "./icons";
import { useGenerateOutline, OutlineChapter, OutlineLesson, GeneratedOutline } from "../hooks/useGenerateOutline";

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
 <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="p-6 from-[#1A1A2E] to-[#2B2D62] text-white flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-xl font-bold shadow-md">
 🪄
 </span>
 <div>
 <h3 className="text-base font-black text-white">Trợ lý AI tạo Đề cương (Mục 2.1)</h3>
 <p className="text-xs -[#FAF7F2]">Xây dựng cấu trúc chương trình học chuẩn mực dựa trên thực tiễn tốt nhất.</p>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="text-gray-400 hover:text-white font-black text-lg p-2 transition-colors"
 >
 
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
 {step === "params" ? (
 <div className="flex flex-col gap-5 animate-fadeIn">
 <div>
 <label className="block text-xs font-black text-[#2C3039] uppercase tracking-wide mb-1.5">
 Chủ đề Khóa học &amp; Lĩnh vực
 </label>
 <input
 type="text"
 value={topic}
 onChange={(e) => setTopic(e.target.value)}
 className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5D5FF] text-[#2C3039] font-bold text-sm focus:outline-none focus:border-[#E8E2D9] transition-all"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-black text-[#2C3039] uppercase tracking-wide mb-1.5">
 Đối tượng Mục tiêu
 </label>
 <input
 type="text"
 value={targetAudience}
 onChange={(e) => setTargetAudience(e.target.value)}
 className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#E8E2D9]"
 />
 </div>
 <div>
 <label className="block text-xs font-black text-[#2C3039] uppercase tracking-wide mb-1.5">
 Trình độ Mục tiêu
 </label>
 <select
 value={skillLevel}
 onChange={(e) => setSkillLevel(e.target.value)}
 className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#2C3039] bg-white focus:outline-none focus:border-[#E8E2D9]"
 >
 <option value="Beginner">Người mới bắt đầu (Cơ bản)</option>
 <option value="Intermediate to Advanced">Trung bình đến Cao cấp</option>
 <option value="Executive Mastery">Chuyên gia</option>
 </select>
 </div>
 </div>

 {/* Teaching Methodology Selection */}
 <div>
 <label className="block text-xs font-black text-[#2C3039] uppercase tracking-wide mb-2">
 Phương pháp Giảng dạy (Chiến lược Cấu trúc)
 </label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button
 type="button"
 onClick={() => setMethodology("80/20 Practical Application vs Theoretical Concepts")}
 className={twMerge(
 "p-4 rounded-2xl border-2 text-left transition-all",
 methodology.includes("80/20")
 ? "border-[#E8E2D9] bg-[#F0F0FF] text-[#C0392B] shadow-xs font-bold"
 : "border-[#E8E2D9] text-[#8A8478] hover:border-gray-300"
 )}
 >
 <p className="text-xs font-extrabold"> 80/20 Thực hành vs Lý thuyết (Khuyên dùng)</p>
 <p className="text-[11px] font-semibold text-[#8A8478] mt-1">
 Chương trình chú trọng dự án; 80% thời gian thực hành &amp; làm bài tập, 20% lý thuyết nền tảng.
 </p>
 </button>

 <button
 type="button"
 onClick={() => setMethodology("Theoretical Deep-Dive & Academic Analysis")}
 className={twMerge(
 "p-4 rounded-2xl border-2 text-left transition-all",
 !methodology.includes("80/20")
 ? "border-[#E8E2D9] bg-[#F0F0FF] text-[#C0392B] shadow-xs font-bold"
 : "border-[#E8E2D9] text-[#8A8478] hover:border-gray-300"
 )}
 >
 <p className="text-xs font-extrabold"> Nắm vững Học thuật Toàn diện</p>
 <p className="text-[11px] font-semibold text-[#8A8478] mt-1">
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
 <h4 className="text-sm font-extrabold text-[#2C3039]">Đang tạo đề cương khóa học bằng AI...</h4>
 <p className="text-xs text-[#8A8478] max-w-sm">
 Đang cấu trúc các chương dựa trên phương pháp bạn đã chọn.
 </p>
 </div>
 ) : error ? (
 <div className="py-20 flex flex-col items-center justify-center gap-4 text-center text-red-500">
 <h4 className="text-sm font-extrabold">{error}</h4>
 <button disabled={isGenerating} onClick={handleGenerate} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 disabled:opacity-50">
 Thử lại
 </button>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-extrabold -[#2C3039] px-3 py-1 bg-emerald-50 rounded-xl border -[#FAF7F2]">
 Đã tạo Đề cương bằng AI
 </span>
 <button
 type="button"
 onClick={() => setStep("params")}
 className="text-xs font-bold -[#C0392B] hover:underline"
 >
 ← Thay đổi thông số
 </button>
 </div>

 <p className="text-xs text-[#8A8478] font-semibold">
 Xem lại và chỉnh sửa tiêu đề các chương, bài học đã tạo trước khi áp dụng vào chương trình chính.
 </p>

 <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2">
 {outline.chapters.map((ch, cIdx) => (
 <div key={cIdx} className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#E8E2D9] flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <h5 className="text-sm font-black text-[#2C3039]">
 {cIdx + 1}. {ch.title}
 </h5>
 <span className="text-[10px] font-bold text-gray-400 uppercase">{ch.lessons.length} Bài học</span>
 </div>

 <ul className="flex flex-col gap-2">
 {ch.lessons.map((lesson, lIdx) => (
 <li key={lIdx} className={twMerge(
 "flex flex-col gap-1.5 p-2.5 rounded-xl border shadow-2xs",
 lesson.type === "quiz"
 ? "bg-amber-50 border-amber-200"
 : "bg-white border-[#E8E2D9]"
 )}>
 <div className="flex items-center gap-2">
 <span className="text-xs font-extrabold">
 {lesson.type === "quiz" ? "" : ""}
 </span>
 <input
 type="text"
 value={lesson.title}
 onChange={(e) => updateLessonTitle(cIdx, lIdx, e.target.value)}
 className="flex-1 text-xs font-bold text-gray-800 bg-transparent focus:outline-none focus:text-[#C0392B]"
 />
 <span className={twMerge(
 "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0",
 lesson.type === "quiz"
 ? "bg-amber-100 text-amber-700"
 : "-[#FAF7F2] -[#C0392B]"
 )}>
 {lesson.type === "quiz" ? "Trắc nghiệm" : "Tài liệu"}
 </span>
 </div>
 {/* Preview nội dung */}
 {lesson.type === "document" && lesson.content && (
 <p className="text-[11px] text-gray-400 font-medium ml-6 line-clamp-2">
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
 <div className="p-4 px-6 bg-[#F8F9FF] border-t border-[#E8E2D9] flex items-center justify-between">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2 rounded-xl text-xs font-extrabold text-[#8A8478] hover:bg-gray-200 transition-colors"
 >
 Hủy bỏ
 </button>

 {step === "params" ? (
 <button
 type="button"
 onClick={handleGenerate}
 className="px-6 py-2.5 bg-[#C0392B] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2"
 >
 <span> Tạo Đề cương</span>
 </button>
 ) : (
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={handleGenerate}
 disabled={isGenerating}
 className="px-4 py-2 bg-white border border-[#D5D5FF] text-[#C0392B] text-xs font-extrabold rounded-xl hover:bg-[#FAF8FF] transition-all disabled:opacity-50"
 >
 Tạo lại
 </button>
 <button
 type="button"
 onClick={handleApply}
 disabled={isGenerating || outline.chapters.length === 0}
 className="px-6 py-2.5 bg-[#1A1A2E] text-white text-xs font-black rounded-xl shadow-md hover:bg-[#C0392B] transition-all disabled:opacity-50"
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