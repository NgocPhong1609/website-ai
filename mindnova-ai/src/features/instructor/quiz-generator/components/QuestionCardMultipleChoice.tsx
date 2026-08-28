"use client";

import React, { useState } from "react";
import { GeneratedQuestion } from "../types/quizGenerator.types";

interface QuestionCardMultipleChoiceProps {
 question: GeneratedQuestion;
 index: number;
 onUpdate: (id: string, updated: Partial<GeneratedQuestion>) => void;
 onApprove: (id: string) => void;
 onDelete: (id: string) => void;
 onRegenerate: (id: string) => void;
}

export function QuestionCardMultipleChoice({
 question,
 index,
 onUpdate,
 onApprove,
 onDelete,
 onRegenerate,
}: QuestionCardMultipleChoiceProps) {
 const [isEditing, setIsEditing] = useState(false);
 const [draftQ, setDraftQ] = useState(question.question);
 const [draftOptions, setDraftOptions] = useState<string[]>([...question.options]);
 const [draftCorrectIndex, setDraftCorrectIndex] = useState<number>(question.correct_answer_index ?? 0);
 const [draftExplanation, setDraftExplanation] = useState(question.explanation);
 const [draftPoints, setDraftPoints] = useState(question.points);

 const isApproved = question.reviewStatus === "approved" || question.reviewStatus === "edited";

 const handleSaveEdit = () => {
 onUpdate(question.id, {
 question: draftQ,
 options: draftOptions,
 correct_answer_index: draftCorrectIndex,
 explanation: draftExplanation,
 points: draftPoints,
 });
 setIsEditing(false);
 };

 return (
 <div
 className={`p-6 rounded-3xl bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4 ${
 isApproved ? "-[#2C3039]/50 bg-emerald-50/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)]" : "border-[#E8E2D9]"
 }`}
 >
 {/* Top Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-7 h-7 rounded-xl bg-indigo-50 text-[#C0392B] font-black text-xs flex items-center justify-center border -[#FAF7F2]">
 #{index + 1}
 </span>
 <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg -[#FAF7F2]/80 text-[#C0392B] border -[#FAF7F2]">
 Trắc nghiệm (MCQ)
 </span>
 <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-[#8A8478] border">
 {question.difficulty}
 </span>
 {isApproved && (
 <span className="text-xs font-extrabold -[#2C3039] flex items-center gap-1">
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
 ? "-[#2C3039] text-white cursor-default"
 : "bg-emerald-50 hover:-[#2C3039] -[#2C3039] hover:text-white border -[#FAF7F2]"
 }`}
 >
 {isApproved ? "Approved " : " Approve"}
 </button>
 <button
 type="button"
 onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
 className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-[#C0392B] text-[#C0392B] hover:text-white border -[#FAF7F2] text-xs font-extrabold transition-all cursor-pointer"
 >
 {isEditing ? " Lưu sửa" : " Chỉnh sửa"}
 </button>
 <button
 type="button"
 onClick={() => onRegenerate(question.id)}
 className="px-3 py-1.5 rounded-xl bg-purple-50 hover:-[#C0392B] -[#C0392B] hover:text-white border -[#FAF7F2] text-xs font-extrabold transition-all cursor-pointer"
 title="Sinh lại riêng câu này bằng AI"
 >
 Sinh lại
 </button>
 <button
 type="button"
 onClick={() => onDelete(question.id)}
 className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-extrabold transition-all cursor-pointer"
 >
 Xóa
 </button>
 </div>
 </div>

 {/* Question Body */}
 {isEditing ? (
 <div className="flex flex-col gap-4 pt-2">
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung câu hỏi</label>
 <textarea
 value={draftQ}
 onChange={(e) => setDraftQ(e.target.value)}
 rows={2}
 className="w-full p-3 rounded-xl border -[#C0392B] font-bold text-sm text-gray-800 focus:outline-none"
 />
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-gray-700">Các đáp án (Chọn radio để đánh dấu đáp án ĐÚNG)</label>
 {draftOptions.map((opt, oIdx) => (
 <div key={oIdx} className="flex items-center gap-2">
 <input
 type="radio"
 name={`correct_${question.id}`}
 checked={draftCorrectIndex === oIdx}
 onChange={() => setDraftCorrectIndex(oIdx)}
 className="w-4 h-4 -[#2C3039] cursor-pointer"
 />
 <span className="font-bold text-xs w-6">{String.fromCharCode(65 + oIdx)}.</span>
 <input
 type="text"
 value={opt}
 onChange={(e) => {
 const newOpts = [...draftOptions];
 newOpts[oIdx] = e.target.value;
 setDraftOptions(newOpts);
 }}
 className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
 draftCorrectIndex === oIdx ? "-[#2C3039] bg-emerald-50/50 font-bold -[#2C3039]" : "border-[#E8E2D9]"
 }`}
 />
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-700 mb-1">Giải thích đáp án</label>
 <input
 type="text"
 value={draftExplanation}
 onChange={(e) => setDraftExplanation(e.target.value)}
 className="w-full p-2.5 rounded-xl border border-[#E8E2D9] text-xs font-medium"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Điểm tối đa (max_score)</label>
 <input
 type="number"
 step="0.25"
 min="0"
 value={draftPoints}
 onChange={(e) => {
 const val = parseFloat(e.target.value);
 setDraftPoints(isNaN(val) || val < 0 ? 0 : val);
 }}
 className="w-full p-2.5 rounded-xl border border-[#E8E2D9] text-xs font-bold focus:border-[#C0392B] focus:outline-none"
 />
 </div>
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <h4 className="text-base font-extrabold text-[#2C3039] leading-snug">
 {question.question}
 </h4>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
 {question.options.map((opt, oIdx) => {
 const isCorrect = oIdx === question.correct_answer_index;
 return (
 <div
 key={oIdx}
 className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
 isCorrect
 ? "-[#2C3039] bg-emerald-50 -[#2C3039] font-bold shadow-xs"
 : "border-[#E8E2D9] bg-[#FEFCF9] text-gray-700"
 }`}
 >
 <span
 className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
 isCorrect ? "-[#2C3039] text-white" : "bg-gray-200 text-[#8A8478]"
 }`}
 >
 {String.fromCharCode(65 + oIdx)}
 </span>
 <span>{opt}</span>
 {isCorrect && <span className="ml-auto -[#2C3039] font-extrabold text-xs"> Đáp án đúng</span>}
 </div>
 );
 })}
 </div>

 {question.explanation && (
 <div className="p-3 rounded-xl bg-indigo-50/60 border -[#FAF7F2] text-xs -[#C0392B] font-medium leading-relaxed">
 <strong className="text-[#C0392B] font-extrabold"> Giải thích từ AI:</strong> {question.explanation}
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
