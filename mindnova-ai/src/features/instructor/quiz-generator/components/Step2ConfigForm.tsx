"use client";

import React from "react";
import { QuizConfig, DifficultyType } from "../types/quizGenerator.types";
import { QuizImageField } from "./QuizImageField";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Loader2, Sparkles, Zap } from "lucide-react";

interface Step2ConfigFormProps {
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  embeddedMode?: boolean;
}

export function Step2ConfigForm({
  config,
  onChangeConfig,
  onBack,
  onGenerate,
  isGenerating = false,
  embeddedMode = false,
}: Step2ConfigFormProps) {
  const mc = config.multiple_choice_count;
  const essay = config.essay_count;
  const total = config.total_questions;
  const sum = mc + essay;
  const isValidBalance = sum === total;

  const mcPercent = total > 0 ? Math.round((mc / total) * 100) : 0;
  const essayPercent = total > 0 ? Math.round((essay / total) * 100) : 0;

  return (
    <div className="p-8 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          {!embeddedMode && (
            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-wider">
              Bước 2 / 5
            </span>
          )}
          <h2 className="text-xl font-bold text-slate-900">
            {embeddedMode ? "Cấu Hình Bài Kiểm Tra AI Cho Chuyên Đề" : "Cấu Hình Thông Số Đề Kiểm Tra"}
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Thiết lập tên bài kiểm tra, độ khó, chủ đề AI và số lượng câu hỏi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Metadata */}
        <div className="flex flex-col gap-4">
          {!embeddedMode && config.source_type === "course" && config.course_title && (
            <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Khóa học được chọn</span>
                  <span className="text-xs font-bold text-slate-900">{config.course_title}{config.module_id ? ` — ${config.module_title || `Chương #${config.module_id}`}` : ""}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white text-blue-500 text-[11px] font-semibold rounded-lg border border-blue-100 shadow-sm">
                Tự động từ Bước 1
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài kiểm tra <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onChangeConfig({ title: e.target.value })}
              className="w-full p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              placeholder="VD: Kiểm tra Hệ nhị phân & Máy tính"
            />
          </div>

          {embeddedMode && config.source_type !== "course" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề hoặc Yêu cầu AI sinh câu hỏi</label>
              <input
                type="text"
                value={config.topic || ""}
                onChange={(e) => onChangeConfig({ topic: e.target.value })}
                className="w-full p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="VD: Kiến thức bài học, HTML/CSS căn bản, React Hooks..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn</label>
            <textarea
              value={config.description}
              onChange={(e) => onChangeConfig({ description: e.target.value })}
              rows={3}
              className="w-full p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              placeholder="Mô tả mục tiêu của bài kiểm tra..."
            />
          </div>

          <QuizImageField
            label="Ảnh đại diện Quiz"
            purpose="thumbnail"
            value={{ url: config.thumbnail_url || null, r2_key: config.thumbnail_r2_key || null }}
            onChange={(image) => onChangeConfig({ thumbnail_url: image.url, thumbnail_r2_key: image.r2_key })}
          />

          {/* Difficulty Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Độ khó câu hỏi</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: "easy", label: "Dễ", icon: <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" aria-hidden /> },
                { key: "medium", label: "Trung bình", icon: <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" aria-hidden /> },
                { key: "hard", label: "Khó", icon: <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" aria-hidden /> },
                { key: "mixed", label: "Hỗn hợp", icon: <Zap className="h-4 w-4" aria-hidden /> },
              ].map((diff) => (
                <button
                  key={diff.key}
                  type="button"
                  onClick={() => onChangeConfig({ difficulty: diff.key as DifficultyType })}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    config.difficulty === diff.key
                      ? "border-blue-500 bg-blue-50 text-blue-500 shadow-xs"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian làm bài (Phút)</label>
              <input
                type="number"
                min={0}
                max={180}
                value={config.time_limit_minutes}
                onChange={(e) => onChangeConfig({ time_limit_minutes: parseInt(e.target.value) || 0 })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm đạt (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={config.passing_score}
                onChange={(e) => onChangeConfig({ passing_score: parseInt(e.target.value) || 70 })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Question Counts Breakdown Widget */}
        <div className="p-6 rounded-lg bg-slate-50 border border-blue-100 text-slate-900 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span><Zap className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Cân Bằng Cấu Trúc Đề</span>
              </h3>
              <span className="px-3 py-1 rounded-lg bg-white text-blue-500 text-xs font-mono font-bold border border-blue-100 shadow-sm">
                Tổng: {total} câu
              </span>
            </div>

            {/* Total Questions Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Tổng số câu hỏi mong muốn</span>
                <span className="text-blue-500 font-bold">{total} câu</span>
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
                className="w-full accent-blue-500 cursor-pointer h-2 bg-blue-100 rounded-lg"
              />
            </div>

            {/* MCQ & Essay Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-white border border-blue-100 shadow-sm flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Số câu trắc nghiệm</label>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={mc}
                  onChange={(e) => onChangeConfig({ multiple_choice_count: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-blue-100 text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-blue-100 shadow-sm flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Số câu tự luận</label>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={essay}
                  onChange={(e) => onChangeConfig({ essay_count: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-blue-100 text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Realtime Balance Progress Bar */}
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-blue-700">Trắc nghiệm: {mc} ({mcPercent}%)</span>
                <span className="text-sky-700">Tự luận: {essay} ({essayPercent}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-blue-100 overflow-hidden flex border border-blue-200">
                <div
                  style={{ width: `${mcPercent}%` }}
                  className="h-full bg-blue-600 transition-all duration-300"
                />
                <div
                  style={{ width: `${essayPercent}%` }}
                  className="h-full bg-sky-600 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Realtime Validation Message */}
          <div className="mt-4">
            {isValidBalance ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                <span>Cấu trúc đề hợp lệ: {mc} trắc nghiệm + {essay} tự luận = {total} câu.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                <span>Chưa khớp: Bạn đang chọn {mc} trắc nghiệm + {essay} tự luận = {sum} câu, nhưng tổng số câu yêu cầu là {total}.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className={`flex items-center border-t border-slate-100 pt-4 mt-2 ${embeddedMode ? "justify-end" : "justify-between"}`}>
        {!embeddedMode && (
          <button
            type="button"
            onClick={onBack}
            disabled={isGenerating}
            className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Quay lại
          </button>
        )}

        <button
          type="button"
          onClick={onGenerate}
          disabled={!isValidBalance || !config.title.trim() || isGenerating}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {isGenerating ? (
            <span><Loader2 className="inline h-4 w-4 mr-1 align-text-bottom animate-spin" aria-hidden />Đang tạo câu hỏi bằng AI...</span>
          ) : (
            <span><Sparkles className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />AI Sinh {total} Câu Hỏi Ngay<ArrowRight className="inline h-4 w-4 ml-1 align-text-bottom" aria-hidden /></span>
          )}
        </button>
      </div>
    </div>
  );
}
