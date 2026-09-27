"use client";

import React, { useState } from "react";
import { GeneratedQuestion } from "../types/quizGenerator.types";
import { QuizImageField } from "./QuizImageField";
import { Check, CheckCircle2, Pencil, Save } from "lucide-react";

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
 const [draftQuestionImage, setDraftQuestionImage] = useState({ url: question.image_url || null, r2_key: question.image_r2_key || null });
 const [draftSampleAnswer, setDraftSampleAnswer] = useState(sampleAnswerStr);
 const [draftRubric, setDraftRubric] = useState(rubricStr);
 const [draftPoints, setDraftPoints] = useState(question.points);

 const isApproved = question.reviewStatus === "approved" || question.reviewStatus === "edited";

 const handleSaveEdit = () => {
 onUpdate(question.id, {
 question: draftQ,
 image_url: draftQuestionImage.url,
 image_r2_key: draftQuestionImage.r2_key,
 sample_answer: draftSampleAnswer,
 rubric: draftRubric,
 points: draftPoints,
 });
 setIsEditing(false);
 };

 return (
 <div
 className={`p-6 rounded-lg bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4 ${
 isApproved ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200"
 }`}
 >
 {/* Top Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-7 h-7 rounded-lg bg-sky-50 text-blue-500 font-bold text-xs flex items-center justify-center border border-slate-200">
 #{index + 1}
 </span>
 <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-50 text-blue-500 border border-slate-200">
 Tự luận (Essay)
 </span>
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border">
 {question.difficulty}
 </span>
 {isApproved && (
 <span className="text-xs font-semibold text-blue-500 flex items-center gap-1">
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
 className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
 isApproved
 ? "bg-emerald-600 text-white cursor-default"
 : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200"
 }`}
 >
 {isApproved ? <><CheckCircle2 className="inline h-3.5 w-3.5 mr-1 align-text-bottom" aria-hidden />Approved</> : <><Check className="inline h-3.5 w-3.5 mr-1 align-text-bottom" aria-hidden />Approve</>}
 </button>
 <button
 type="button"
 onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
 className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-500 hover:text-white border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
 >
 {isEditing ? <><Save className="inline h-3.5 w-3.5 mr-1 align-text-bottom" aria-hidden />Lưu sửa</> : <><Pencil className="inline h-3.5 w-3.5 mr-1 align-text-bottom" aria-hidden />Chỉnh sửa</>}
 </button>
 <button
 type="button"
 onClick={() => onRegenerate(question.id)}
 className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-blue-600 text-blue-500 hover:text-white border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
 title="Sinh lại riêng câu này bằng AI"
 >
 Sinh lại
 </button>
 <button
 type="button"
 onClick={() => onDelete(question.id)}
 className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 text-xs font-semibold transition-all cursor-pointer"
 >
 Xóa
 </button>
 </div>
 </div>

 {/* Question Body */}
 {isEditing ? (
 <div className="flex flex-col gap-4 pt-2">
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu hỏi tự luận</label>
 <textarea
 value={draftQ}
 onChange={(e) => setDraftQ(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-lg border-blue-500 font-bold text-sm text-slate-800 focus:outline-none"
 />
 </div>

 <QuizImageField
 label="Ảnh câu hỏi"
 purpose="question"
 value={draftQuestionImage}
 onChange={setDraftQuestionImage}
 />

 <div>
 <label className="block text-xs font-bold text-blue-500 mb-1">Đáp án tham khảo mẫu (Sample Answer)</label>
 <textarea
 value={draftSampleAnswer}
 onChange={(e) => setDraftSampleAnswer(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-lg border border-slate-200 bg-sky-50/40 text-xs font-medium text-blue-500 focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Thang điểm / Rubric chấm điểm (% &amp; Điểm thành phần)
 </label>
 <p className="text-[10px] text-slate-500 font-medium mb-1">
 Gợi ý mô tả %: - Ý 1 (Khái niệm): 40% = 1.0đ | - Ý 2 (Nguyên nhân): 30% = 0.75đ | - Ý 3 (Ví dụ): 30% = 0.75đ
 </p>
 <textarea
 value={draftRubric}
 onChange={(e) => setDraftRubric(e.target.value)}
 rows={3}
 className="w-full p-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
 placeholder="- Ý 1: 40% = 1.0đ..."
 />
 </div>

 <div className="w-1/2 md:w-1/3">
 <label className="block text-xs font-bold text-blue-500 mb-1">Điểm tối đa CẢ CÂU (max_score)</label>
 <input
 type="number"
 step="0.25"
 min="0"
 value={draftPoints}
 onChange={(e) => {
 const val = parseFloat(e.target.value);
 setDraftPoints(isNaN(val) || val < 0 ? 0 : val);
 }}
 className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-blue-500 focus:outline-none focus:border-blue-500"
 />
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <h4 className="text-base font-semibold text-slate-900 leading-snug">
 {question.question}
 </h4>
 {question.image_url && <img src={question.image_url} alt={`Ảnh câu hỏi ${index + 1}`} className="max-h-64 rounded-lg border object-contain" />}

 {sampleAnswerStr && (
 <div className="p-4 rounded-lg bg-sky-50/60 border border-slate-200 flex flex-col gap-1 text-xs">
 <span className="font-semibold text-blue-500 flex items-center gap-1">
 Đáp án tham khảo mẫu:
 </span>
 <p className="text-sky-950 font-medium leading-relaxed whitespace-pre-line">
 {sampleAnswerStr}
 </p>
 </div>
 )}

 {rubricStr && (
 <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1 text-xs">
 <span className="font-bold text-slate-700 flex items-center gap-1">
 Gợi ý Rubric chấm điểm:
 </span>
 <p className="text-slate-500 font-medium whitespace-pre-line leading-relaxed">
 {rubricStr}
 </p>
 </div>
 )}

 <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-t border-slate-100 pt-2 mt-1">
 <span>Thang điểm: {question.points} điểm</span>
 <span>Trạng thái: {question.reviewStatus}</span>
 </div>
 </div>
 )}
 </div>
 );
}
