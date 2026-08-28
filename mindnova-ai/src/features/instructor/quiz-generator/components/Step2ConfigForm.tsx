"use client";

import React from "react";
import { QuizConfig, DifficultyType } from "../types/quizGenerator.types";

interface Step2ConfigFormProps {
 config: QuizConfig;
 onChangeConfig: (fields: Partial<QuizConfig>) => void;
 onBack: () => void;
 onGenerate: () => void;
 isGenerating?: boolean;
}

export function Step2ConfigForm({ config, onChangeConfig, onBack, onGenerate, isGenerating = false }: Step2ConfigFormProps) {
 const mc = config.multiple_choice_count;
 const essay = config.essay_count;
 const total = config.total_questions;
 const sum = mc + essay;
 const isValidBalance = sum === total;

 const mcPercent = total > 0 ? Math.round((mc / total) * 100) : 0;
 const essayPercent = total > 0 ? Math.round((essay / total) * 100) : 0;

 return (
 <div className="p-8 bg-white rounded-3xl border border-[#E8E2D9] shadow-sm flex flex-col gap-6 animate-fadeIn">
 {/* Header */}
 <div>
 <div className="flex items-center gap-2">
 <span className="px-3 py-1 bg-indigo-50 text-[#C0392B] text-xs font-black rounded-lg border -[#FAF7F2] uppercase tracking-wider">
 Bước 2 / 5
 </span>
 <h2 className="text-xl font-black text-[#2C3039]">Cấu Hình Thông Số Đề Kiểm Tra</h2>
 </div>
 <p className="text-xs text-[#8A8478] font-medium mt-1">
 Thiết lập tên bài kiểm tra, độ khó, tỷ lệ số câu trắc nghiệm và tự luận.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Left Column: Metadata */}
 <div className="flex flex-col gap-4">
 {config.source_type === "course" && config.course_title && (
 <div className="p-3.5 rounded-xl bg-indigo-50 border -[#FAF7F2] flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-base"></span>
 <div>
 <span className="text-[10px] font-black -[#C0392B] uppercase tracking-wider block">Khóa học được chọn</span>
 <span className="text-xs font-black text-[#2C3039]">{config.course_title}</span>
 </div>
 </div>
 <span className="px-2.5 py-1 bg-white -[#C0392B] text-[11px] font-extrabold rounded-lg border -[#FAF7F2] shadow-2xs">
 Tự động từ Bước 1
 </span>
 </div>
 )}

 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Tên bài kiểm tra</label>
 <input
 type="text"
 value={config.title}
 onChange={(e) => onChangeConfig({ title: e.target.value })}
 className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
 placeholder="VD: Kiểm tra Hệ nhị phân & Máy tính"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả ngắn</label>
 <textarea
 value={config.description}
 onChange={(e) => onChangeConfig({ description: e.target.value })}
 rows={3}
 className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#C0392B]"
 placeholder="Mô tả mục tiêu của bài kiểm tra..."
 />
 </div>

 {/* Difficulty Selector */}
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1.5">Độ khó câu hỏi</label>
 <div className="grid grid-cols-4 gap-2">
 {[
 { key: "easy", label: "Dễ", icon: "🟢" },
 { key: "medium", label: "Trung bình", icon: "🟡" },
 { key: "hard", label: "Khó", icon: "" },
 { key: "mixed", label: "Hỗn hợp", icon: "" },
 ].map((diff) => (
 <button
 key={diff.key}
 type="button"
 onClick={() => onChangeConfig({ difficulty: diff.key as DifficultyType })}
 className={`p-2.5 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
 config.difficulty === diff.key
 ? "border-[#C0392B] bg-indigo-50 text-[#C0392B] shadow-xs"
 : "border-[#E8E2D9] text-[#8A8478] hover:border-gray-300"
 }`}
 >
 <span className="text-sm">{diff.icon}</span>
 <span>{diff.label}</span>
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 pt-1">
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Thời gian làm bài (Phút)</label>
 <input
 type="number"
 min={0}
 max={180}
 value={config.time_limit_minutes}
 onChange={(e) => onChangeConfig({ time_limit_minutes: parseInt(e.target.value) || 0 })}
 className="w-full p-3 rounded-xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Điểm đạt (%)</label>
 <input
 type="number"
 min={0}
 max={100}
 value={config.passing_score}
 onChange={(e) => onChangeConfig({ passing_score: parseInt(e.target.value) || 70 })}
 className="w-full p-3 rounded-xl border border-[#E8E2D9] bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C0392B]"
 />
 </div>
 </div>
 </div>

 {/* Right Column: Question Counts Breakdown Widget (Light Theme) */}
 <div className="p-6 rounded-3xl bg-[#F5F4FE] border -[#FAF7F2]/90 text-[#2C3039] flex flex-col justify-between shadow-xs">
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-black text-[#2C3039] uppercase tracking-wider flex items-center gap-2">
 <span>️ Cân Bằng Cấu Trúc Đề</span>
 </h3>
 <span className="px-3 py-1 rounded-xl bg-white -[#C0392B] text-xs font-mono font-black border -[#FAF7F2] shadow-2xs">
 Tổng: {total} câu
 </span>
 </div>

 {/* Total Questions Slider */}
 <div>
 <div className="flex justify-between text-xs font-bold mb-1">
 <span className="text-gray-700">Tổng số câu hỏi mong muốn</span>
 <span className="text-[#C0392B] font-black">{total} câu</span>
 </div>
 <input
 type="range"
 min={5}
 max={50}
 value={total}
 onChange={(e) => {
 const newTotal = parseInt(e.target.value);
 const newMc = Math.round(newTotal * 0.75);
 const newEssay = newTotal - newMc;
 onChangeConfig({ total_questions: newTotal, multiple_choice_count: newMc, essay_count: newEssay });
 }}
 className="w-full accent-[#C0392B] cursor-pointer h-2 -[#FAF7F2] rounded-lg"
 />
 </div>

 {/* MCQ & Essay Inputs (Light Theme - White BG & Dark Readable Text) */}
 <div className="grid grid-cols-2 gap-3 pt-2">
 <div className="p-3.5 rounded-2xl bg-white border -[#FAF7F2]/80 shadow-2xs flex flex-col gap-1.5">
 <label className="text-[11px] font-black -[#C0392B] uppercase tracking-wider">Số câu trắc nghiệm</label>
 <input
 type="number"
 min={0}
 max={total}
 value={mc}
 onChange={(e) => onChangeConfig({ multiple_choice_count: parseInt(e.target.value) || 0 })}
 className="w-full p-2.5 rounded-xl bg-[#FAF9FF] border -[#FAF7F2] text-[#2C3039] font-black text-sm focus:outline-none focus:border-[#C0392B] focus:bg-white"
 />
 </div>

 <div className="p-3.5 rounded-2xl bg-white border -[#FAF7F2]/80 shadow-2xs flex flex-col gap-1.5">
 <label className="text-[11px] font-black -[#C0392B] uppercase tracking-wider">Số câu tự luận</label>
 <input
 type="number"
 min={0}
 max={total}
 value={essay}
 onChange={(e) => onChangeConfig({ essay_count: parseInt(e.target.value) || 0 })}
 className="w-full p-2.5 rounded-xl bg-[#FAF9FF] border -[#FAF7F2] text-[#2C3039] font-black text-sm focus:outline-none focus:border-[#C0392B] focus:bg-white"
 />
 </div>
 </div>

 {/* Realtime Balance Progress Bar */}
 <div className="mt-2 flex flex-col gap-2">
 <div className="flex justify-between text-[11px] font-black">
 <span className="-[#C0392B]">Trắc nghiệm: {mc} ({mcPercent}%)</span>
 <span className="-[#C0392B]">Tự luận: {essay} ({essayPercent}%)</span>
 </div>
 <div className="w-full h-3 rounded-full -[#FAF7F2] overflow-hidden flex border -[#FAF7F2]/60">
 <div
 style={{ width: `${mcPercent}%` }}
 className="h-full -[#C0392B] -[#C0392B] transition-all duration-300"
 />
 <div
 style={{ width: `${essayPercent}%` }}
 className="h-full -[#C0392B] to-pink-500 transition-all duration-300"
 />
 </div>
 </div>
 </div>

 {/* Realtime Validation Message */}
 <div className="mt-4">
 {isValidBalance ? (
 <div className="p-3.5 rounded-2xl bg-emerald-50 border -[#FAF7F2] -[#2C3039] text-xs font-bold flex items-center gap-2 shadow-2xs">
 <span></span>
 <span>Cấu trúc đề hợp lệ: {mc} trắc nghiệm + {essay} tự luận = {total} câu.</span>
 </div>
 ) : (
 <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
 <span>️</span>
 <span>Chưa khớp: Bạn đang chọn {mc} trắc nghiệm + {essay} tự luận = {sum} câu, nhưng tổng số câu yêu cầu là {total}.</span>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Footer Navigation */}
 <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
 <button
 type="button"
 onClick={onBack}
 disabled={isGenerating}
 className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50"
 >
 🠔 Quay lại
 </button>

 <button
 type="button"
 onClick={onGenerate}
 disabled={!isValidBalance || !config.title.trim() || isGenerating}
 className="px-8 py-3 bg-[#C0392B] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
 >
 {isGenerating ? (
 <span> Đang tạo câu hỏi...</span>
 ) : (
 <span> Tạo {total} câu hỏi bằng AI</span>
 )}
 </button>
 </div>
 </div>
 );
}
