"use client";

import React from "react";
import { QuizConfig, DifficultyType } from "../types/quizGenerator.types";

interface Step2ConfigFormProps {
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export function Step2ConfigForm({ config, onChangeConfig, onBack, onGenerate }: Step2ConfigFormProps) {
  const mc = config.multiple_choice_count;
  const essay = config.essay_count;
  const total = config.total_questions;
  const sum = mc + essay;
  const isValidBalance = sum === total;

  const mcPercent = total > 0 ? Math.round((mc / total) * 100) : 0;
  const essayPercent = total > 0 ? Math.round((essay / total) * 100) : 0;

  return (
    <div className="p-8 bg-white rounded-3xl border border-[#EAEAF4] shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-[#4F46E5] text-xs font-black rounded-lg border border-indigo-100 uppercase tracking-wider">
            Bước 2 / 5
          </span>
          <h2 className="text-xl font-black text-[#1A1A2E]">Cấu Hình Thông Số Đề Kiểm Tra</h2>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Thiết lập tên bài kiểm tra, độ khó, tỷ lệ số câu trắc nghiệm và tự luận.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Metadata */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tên bài kiểm tra</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onChangeConfig({ title: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
              placeholder="VD: Kiểm tra Hệ nhị phân & Máy tính"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              value={config.description}
              onChange={(e) => onChangeConfig({ description: e.target.value })}
              rows={3}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#4F46E5]"
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
                { key: "hard", label: "Khó", icon: "🔴" },
                { key: "mixed", label: "Hỗn hợp", icon: "🎲" },
              ].map((diff) => (
                <button
                  key={diff.key}
                  type="button"
                  onClick={() => onChangeConfig({ difficulty: diff.key as DifficultyType })}
                  className={`p-2.5 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                    config.difficulty === diff.key
                      ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] shadow-xs"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
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
                className="w-full p-3 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
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
                className="w-full p-3 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Question Counts Breakdown Widget */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E233E] to-[#121626] text-white flex flex-col justify-between shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>⚙️ Cân Bằng Cấu Trúc Đề</span>
              </h3>
              <span className="px-3 py-1 rounded-xl bg-white/10 text-indigo-300 text-xs font-mono font-bold border border-white/10">
                Tổng: {total} câu
              </span>
            </div>

            {/* Total Questions Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-300">Tổng số câu hỏi mong muốn</span>
                <span className="text-indigo-400 font-extrabold">{total} câu</span>
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
                className="w-full accent-[#4F46E5] cursor-pointer"
              />
            </div>

            {/* MCQ & Essay Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-indigo-300 uppercase">Số câu trắc nghiệm</label>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={mc}
                  onChange={(e) => onChangeConfig({ multiple_choice_count: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg bg-black/40 border border-indigo-500/30 text-white font-extrabold text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-purple-300 uppercase">Số câu tự luận</label>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={essay}
                  onChange={(e) => onChangeConfig({ essay_count: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg bg-black/40 border border-purple-500/30 text-white font-extrabold text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Realtime Balance Progress Bar */}
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-extrabold text-gray-300">
                <span className="text-indigo-400">Trắc nghiệm: {mc} ({mcPercent}%)</span>
                <span className="text-purple-400">Tự luận: {essay} ({essayPercent}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden flex border border-white/10">
                <div
                  style={{ width: `${mcPercent}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
                />
                <div
                  style={{ width: `${essayPercent}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Realtime Validation Message */}
          <div className="mt-4">
            {isValidBalance ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <span>✓</span>
                <span>Cấu trúc đề hợp lệ: {mc} trắc nghiệm + {essay} tự luận = {total} câu.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>Chưa khớp: {mc} + {essay} = {sum} (Yêu cầu bằng tổng {total} câu).</span>
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
          className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
        >
          🠔 Quay lại
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!isValidBalance || !config.title.trim()}
          className="px-8 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <span>⚡ Tạo {total} câu hỏi bằng AI</span>
        </button>
      </div>
    </div>
  );
}
