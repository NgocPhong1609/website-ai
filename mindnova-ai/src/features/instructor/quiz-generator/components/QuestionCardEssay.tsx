"use client";

import React, { useState } from "react";
import { GeneratedQuestion } from "../types/quizGenerator.types";

interface QuestionCardEssayProps {
 question: GeneratedQuestion;
 index: number;
 onUpdate: (id: string, updated: Partial<GeneratedQuestion>) => void;
 onApprove: (id: string) => void;
 onDelete: (id: string) => void;
 onRegenerate: (id: string) => void;
}

const formatToString = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          const crit = item.criterion || item.title || item.name || item.description || "";
          const weight = item.weight_percent ? ` (${item.weight_percent}%)` : (item.weight ? ` (${item.weight}%)` : "");
          const score = item.score !== undefined ? ` = ${item.score} điểm` : (item.points !== undefined ? ` = ${item.points} điểm` : "");
          return `- ${crit}${weight}${score}`;
        }
        return String(item);
      })
      .join("\n");
  }
  if (typeof val === "object") {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
};

export function QuestionCardEssay({
 question,
 index,
 onUpdate,
 onApprove,
 onDelete,
 onRegenerate,
}: QuestionCardEssayProps) {
 const [isEditing, setIsEditing] = useState(false);
 const sampleAnswerStr = formatToString(question.sample_answer);
 const rubricStr = formatToString(question.rubric);

 const [draftQ, setDraftQ] = useState(question.question);
 const [draftSampleAnswer, setDraftSampleAnswer] = useState(sampleAnswerStr);
 const [draftRubric, setDraftRubric] = useState(rubricStr);
 const [draftPoints, setDraftPoints] = useState(question.points);

 const isApproved = question.reviewStatus === "approved" || question.reviewStatus === "edited";

 const handleSaveEdit = () => {
 onUpdate(question.id, {
 question: draftQ,
 sample_answer: draftSampleAnswer,
 rubric: draftRubric,
 points: draftPoints,
 });
 setIsEditing(false);
 };

 return (
 <div
 className={`p-6 rounded-3xl bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4 ${
 isApproved ? "text-[#3B82F6]/50 bg-purple-50/10 shadow-[0_4px_20px_rgba(168,85,247,0.05)]" : "border-[#E2E8F0]"
 }`}
 >
 {/* Top Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-7 h-7 rounded-xl bg-purple-50 text-[#3B82F6] font-black text-xs flex items-center justify-center border-[#E2E8F0]">
 #{index + 1}
 </span>
 <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#3B82F6] border-[#E2E8F0]">
 Tự luận (Essay)
 </span>
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-[#64748B] border">
 {question.difficulty}
 </span>
 {isApproved && (
 <span className="text-xs font-extrabold text-[#3B82F6] flex items-center gap-1">
 Đã duyệt
 </span>
 )}
 </div>

 {/* Action Buttons */}
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => onApprove(question.id)}
 disabled={isApproved}
 className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
 isApproved
 ? "text-[#3B82F6] text-white cursor-default"
 : "bg-purple-50 hover:bg-[#2563EB] text-[#3B82F6] hover:text-white border-[#E2E8F0]"
 }`}
 >
 {isApproved ? "Approved " : " Approve"}
 </button>
 <button
 type="button"
 onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
 className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#2563EB] text-[#3B82F6] hover:text-white border-[#E2E8F0] text-xs font-extrabold transition-all cursor-pointer"
 >
 {isEditing ? " Lưu sửa" : " Chỉnh sửa"}
 </button>
 <button
 type="button"
 onClick={() => onRegenerate(question.id)}
 className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#2563EB] text-[#3B82F6] hover:text-white border-[#E2E8F0] text-xs font-extrabold transition-all cursor-pointer"
 title="Sinh lại riêng câu này bằng AI"
 >
 Sinh lại
 </button>
 <button
 type="button"
 onClick={() => onDelete(question.id)}
 className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#DBEAFE] text-xs font-extrabold transition-all cursor-pointer"
 >
 Xóa
 </button>
 </div>
 </div>

 {/* Question Body */}
 {isEditing ? (
 <div className="flex flex-col gap-4 pt-2">
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung câu hỏi tự luận</label>
 <textarea
 value={draftQ}
 onChange={(e) => setDraftQ(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-xl border-[#3B82F6] font-bold text-sm text-gray-800 focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#3B82F6] mb-1">Đáp án tham khảo mẫu (Sample Answer)</label>
 <textarea
 value={draftSampleAnswer}
 onChange={(e) => setDraftSampleAnswer(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-xl border-[#E2E8F0] bg-purple-50/40 text-xs font-medium text-[#3B82F6] focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">
 Thang điểm / Rubric chấm điểm (% &amp; Điểm thành phần)
 </label>
 <p className="text-[10px] text-[#64748B] font-medium mb-1">
 Gợi ý mô tả %: - Ý 1 (Khái niệm): 40% = 1.0đ | - Ý 2 (Nguyên nhân): 30% = 0.75đ | - Ý 3 (Ví dụ): 30% = 0.75đ
 </p>
 <textarea
 value={draftRubric}
 onChange={(e) => setDraftRubric(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-xl border border-[#E2E8F0] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#3B82F6]"
 placeholder="- Ý 1: 40% = 1.0đ..."
 />
 </div>

 <div className="w-1/2 md:w-1/3">
 <label className="block text-xs font-bold text-[#3B82F6] mb-1">Điểm tối đa CẢ CÂU (max_score)</label>
 <input
 type="number"
 step="0.25"
 min="0"
 value={draftPoints}
 onChange={(e) => {
 const val = parseFloat(e.target.value);
 setDraftPoints(isNaN(val) || val < 0 ? 0 : val);
 }}
 className="w-full p-2.5 rounded-xl border-[#E2E8F0] text-xs font-bold text-[#3B82F6] focus:outline-none focus:border-[#3B82F6]"
 />
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <h4 className="text-base font-extrabold text-[#0F172A] leading-snug">
 {question.question}
 </h4>

 {sampleAnswerStr && (
 <div className="p-4 rounded-2xl bg-purple-50/60 border-[#E2E8F0] flex flex-col gap-1 text-xs">
 <span className="font-extrabold text-[#3B82F6] flex items-center gap-1">
 Đáp án tham khảo mẫu:
 </span>
 <p className="text-purple-950 font-medium leading-relaxed whitespace-pre-line">
 {sampleAnswerStr}
 </p>
 </div>
 )}

 {rubricStr && (
 <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-1 text-xs">
 <span className="font-bold text-gray-700 flex items-center gap-1">
 Gợi ý Rubric chấm điểm:
 </span>
 <p className="text-[#64748B] font-medium whitespace-pre-line leading-relaxed">
 {rubricStr}
 </p>
 </div>
 )}

 <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-400 border-t border-gray-100 pt-2 mt-1">
 <span>Thang điểm: {question.points} điểm</span>
 <span>Trạng thái: {question.reviewStatus}</span>
 </div>
 </div>
 )}
 </div>
 );
}
