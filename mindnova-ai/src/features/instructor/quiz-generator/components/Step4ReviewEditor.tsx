"use client";

import React, { useEffect, useState } from "react";
import { GeneratedQuestion, QuizConfig } from "../types/quizGenerator.types";
import { QuestionCardMultipleChoice } from "./QuestionCardMultipleChoice";
import { QuestionCardEssay } from "./QuestionCardEssay";

interface Step4ReviewEditorProps {
  questions: GeneratedQuestion[];
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onUpdateQuestion: (id: string, updated: Partial<GeneratedQuestion>) => void;
  onApproveQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onRegenerateQuestion: (id: string, type: "multiple_choice" | "essay", difficulty: string) => void;
  onRegenerateAll: () => void;
  onSave: (status: "draft" | "published") => void;
  onBack: () => void;
  isSaving: boolean;
  isReviewConfirmed: boolean;
  onConfirmAll: () => void;
}

function parsePassingScore(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100 ? parsed : null;
}

export function Step4ReviewEditor({
  questions,
  config,
  onChangeConfig,
  onUpdateQuestion,
  onApproveQuestion,
  onDeleteQuestion,
  onRegenerateQuestion,
  onRegenerateAll,
  onSave,
  onBack,
  isSaving,
  isReviewConfirmed,
  onConfirmAll,
}: Step4ReviewEditorProps) {
  const [filterType, setFilterType] = useState<"all" | "multiple_choice" | "essay">("all");
  const [passingScoreInput, setPassingScoreInput] = useState(String(config.passing_score));

  useEffect(() => {
    setPassingScoreInput(String(config.passing_score));
  }, [config.passing_score]);

  const mcQuestions = questions.filter((q) => q.type === "multiple_choice");
  const essayQuestions = questions.filter((q) => q.type === "essay");

  const filteredQuestions = questions.filter((q) => {
    if (filterType === "all") return true;
    return q.type === filterType;
  });

  const approvedCount = questions.filter((q) => q.reviewStatus === "approved" || q.reviewStatus === "edited").length;
  const rawTotal = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const totalPoints = Number(rawTotal.toFixed(2));
  const isValidTotal = Math.abs(totalPoints - 10) < 0.001;
  const isLess = totalPoints < 10;
  const isPassingScoreValid = parsePassingScore(passingScoreInput) !== null;

  const handlePassingScoreChange = (value: string) => {
    setPassingScoreInput(value);
    const parsed = parsePassingScore(value);

    if (parsed !== null) {
      onChangeConfig({ passing_score: parsed });
    }
  };

  return (
    <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-[#3B82F6] text-xs font-black rounded-lg border-[#E2E8F0] uppercase tracking-wider">
              Bước 4 / 5
            </span>
            <h2 className="text-xl font-black text-[#0F172A]">Review &amp; Hiệu Chỉnh Đề Kiểm Tra</h2>
          </div>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Bạn giữ toàn quyền biên tập: Chỉnh sửa inline, phê duyệt (Approve), xóa hoặc yêu cầu AI sinh lại từng câu.
          </p>
        </div>

        {/* Realtime Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-2xl bg-blue-50 border-[#E2E8F0] flex items-center gap-2 text-xs font-bold text-[#3B82F6]">
            <span>🎯 Đã duyệt:</span>
            <span className="font-extrabold text-sm">{approvedCount}/{questions.length}</span>
          </div>
          <div
            className={`px-3 py-2 rounded-2xl border flex items-center gap-2 text-xs font-bold ${
              isValidTotal
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <span>⚖️ Tổng điểm hiện tại:</span>
            <span className="font-black text-sm">{totalPoints} / 10</span>
          </div>
        </div>
      </div>

      {/* Final configuration remains visible while questions are reviewed. */}
      <section aria-labelledby="review-config-heading" className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h3 id="review-config-heading" className="text-sm font-black text-[#0F172A]">
              Cấu hình bài kiểm tra
            </h3>
            <p className="mt-1 truncate text-base font-extrabold text-[#0F172A]">{config.title}</p>
            {config.description && (
              <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-[#64748B]">
                {config.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-[#475569]">
              <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5">
                {config.time_limit_minutes} phút
              </span>
              <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5">
                {questions.length} câu hỏi
              </span>
              <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5">
                {mcQuestions.length} câu trắc nghiệm
              </span>
              <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5">
                {essayQuestions.length} câu tự luận
              </span>
              <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5">
                Độ khó: {config.difficulty}
              </span>
            </div>
          </div>

          <label className="flex w-full shrink-0 items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-xs font-extrabold text-[#0F172A] sm:w-auto lg:flex-col lg:items-start lg:gap-1.5">
            <span>Điểm đạt (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={passingScoreInput}
              onChange={(event) => handlePassingScoreChange(event.target.value)}
              disabled={isSaving}
              aria-invalid={!isPassingScoreValid}
              aria-describedby={!isPassingScoreValid ? "passing-score-error" : undefined}
              className="w-24 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-right text-sm font-black text-[#0F172A] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"
            />
            {!isPassingScoreValid && (
              <span id="passing-score-error" role="alert" className="max-w-48 text-[11px] font-semibold leading-relaxed text-rose-700">
                Điểm đạt phải là số nguyên từ 0 đến 100.
              </span>
            )}
          </label>
        </div>
      </section>

      {/* Score Validation Banner */}
      <div>
        {isValidTotal ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border-[#E2E8F0] text-[#0F172A] text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>Tổng điểm hợp lệ: <strong>10 / 10</strong>. Bài kiểm tra đã sẵn sàng để xuất bản.</span>
            </div>
            <span className="px-2.5 py-1 bg-[#0F172A] text-white text-[10px] font-black uppercase rounded-lg">Standard 10.0</span>
          </div>
        ) : isLess ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm chưa đủ 10 (Hiện tại: <strong>{totalPoints} / 10</strong>). Vui lòng điều chỉnh điểm các câu hỏi.</span>
            </div>
            <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg">Thiếu {Number((10 - totalPoints).toFixed(2))}đ</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>Tổng điểm vượt quá 10 (Hiện tại: <strong>{totalPoints} / 10</strong>). Vui lòng giảm điểm các câu hỏi.</span>
            </div>
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg">Vượt {Number((totalPoints - 10).toFixed(2))}đ</span>
          </div>
        )}
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#EFF6FF] border border-blue-50">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-[#3B82F6] text-white shadow-md"
                : "bg-white text-[#64748B] hover:bg-gray-100 border border-[#E2E8F0]"
            }`}
          >
            Tất cả ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("multiple_choice")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "multiple_choice"
                ? "bg-[#3B82F6] text-white shadow-md"
                : "bg-white text-[#64748B] hover:bg-gray-100 border border-[#E2E8F0]"
            }`}
          >
            Trắc nghiệm ({mcQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("essay")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === "essay"
                ? "text-[#3B82F6] text-white shadow-md"
                : "bg-white text-[#64748B] hover:bg-gray-100 border border-[#E2E8F0]"
            }`}
          >
            Tự luận ({essayQuestions.length})
          </button>
        </div>

        {/* Global Action: Regenerate All */}
        <button
          type="button"
          onClick={onRegenerateAll}
          className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🔄 Sinh lại toàn bộ đề</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] font-medium">
            Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            if (q.type === "essay") {
              return (
                <QuestionCardEssay
                  key={q.id}
                  question={q}
                  index={idx}
                  onUpdate={onUpdateQuestion}
                  onApprove={onApproveQuestion}
                  onDelete={onDeleteQuestion}
                  onRegenerate={(id) => onRegenerateQuestion(id, "essay", q.difficulty)}
                />
              );
            }
            return (
              <QuestionCardMultipleChoice
                key={q.id}
                question={q}
                index={idx}
                onUpdate={onUpdateQuestion}
                onApprove={onApproveQuestion}
                onDelete={onDeleteQuestion}
                onRegenerate={(id) => onRegenerateQuestion(id, "multiple_choice", q.difficulty)}
              />
            );
          })
        )}
      </div>

      {/* Footer Navigation & Save Buttons */}
      <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 mt-2 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
        >
          🠔 Sửa cấu hình
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onConfirmAll}
            disabled={isSaving || questions.length === 0 || !isValidTotal || !isPassingScoreValid || isReviewConfirmed}
            className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isReviewConfirmed ? "✓ Đã xác nhận toàn bộ" : "✓ Xác nhận toàn bộ câu hỏi"}
          </button>

          {!isValidTotal && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
              ⚠️ Tổng điểm phải bằng 10 để lưu.
            </span>
          )}

          <button
            type="button"
            onClick={() => onSave("draft")}
            disabled={isSaving || !isValidTotal || !isPassingScoreValid || !isReviewConfirmed}
            className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "Đang lưu..." : "💾 Lưu Nháp"}
          </button>

          <button
            type="button"
            onClick={() => onSave("published")}
            disabled={isSaving || questions.length === 0 || !isValidTotal || !isPassingScoreValid || !isReviewConfirmed}
            className="px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu bài kiểm tra...</span>
              </>
            ) : (
              <span>✨ Hoàn Tất &amp; Thêm Vào Giáo Trình</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
