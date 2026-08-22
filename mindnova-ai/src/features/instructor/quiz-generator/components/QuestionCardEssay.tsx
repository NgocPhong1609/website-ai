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

export function QuestionCardEssay({
  question,
  index,
  onUpdate,
  onApprove,
  onDelete,
  onRegenerate,
}: QuestionCardEssayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQ, setDraftQ] = useState(question.question);
  const [draftSampleAnswer, setDraftSampleAnswer] = useState(question.sample_answer);
  const [draftRubric, setDraftRubric] = useState(question.rubric);
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
        isApproved ? "border-purple-500/50 bg-purple-50/10 shadow-[0_4px_20px_rgba(168,85,247,0.05)]" : "border-[#EAEAF4]"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-black text-xs flex items-center justify-center border border-purple-100">
            #{index + 1}
          </span>
          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
            Tự luận (Essay)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border">
            {question.difficulty}
          </span>
          {isApproved && (
            <span className="text-xs font-extrabold text-purple-600 flex items-center gap-1">
              ✓ Đã duyệt
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
                ? "bg-purple-600 text-white cursor-default"
                : "bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200"
            }`}
          >
            {isApproved ? "Approved ✓" : "✓ Approve"}
          </button>
          <button
            type="button"
            onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white border border-indigo-200 text-xs font-extrabold transition-all cursor-pointer"
          >
            {isEditing ? "💾 Lưu sửa" : "✎ Chỉnh sửa"}
          </button>
          <button
            type="button"
            onClick={() => onRegenerate(question.id)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 text-xs font-extrabold transition-all cursor-pointer"
            title="Sinh lại riêng câu này bằng AI"
          >
            🔄 Sinh lại
          </button>
          <button
            type="button"
            onClick={() => onDelete(question.id)}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-extrabold transition-all cursor-pointer"
          >
            ✕ Xóa
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
              className="w-full p-3 rounded-xl border border-purple-300 font-bold text-sm text-gray-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-800 mb-1">Đáp án tham khảo mẫu (Sample Answer)</label>
            <textarea
              value={draftSampleAnswer}
              onChange={(e) => setDraftSampleAnswer(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/40 text-xs font-medium text-purple-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tiêu chí / Rubric chấm điểm</label>
            <textarea
              value={draftRubric}
              onChange={(e) => setDraftRubric(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none"
            />
          </div>

          <div className="w-1/3">
            <label className="block text-xs font-bold text-gray-700 mb-1">Số điểm câu này</label>
            <input
              type="number"
              step="0.5"
              value={draftPoints}
              onChange={(e) => setDraftPoints(parseFloat(e.target.value) || 5)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-extrabold text-[#1A1A2E] leading-snug">
            {question.question}
          </h4>

          {question.sample_answer && (
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-1 text-xs">
              <span className="font-extrabold text-purple-800 flex items-center gap-1">
                📝 Đáp án tham khảo mẫu:
              </span>
              <p className="text-purple-950 font-medium leading-relaxed whitespace-pre-line">
                {question.sample_answer}
              </p>
            </div>
          )}

          {question.rubric && (
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-1 text-xs">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                🎯 Gợi ý Rubric chấm điểm:
              </span>
              <p className="text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                {question.rubric}
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
