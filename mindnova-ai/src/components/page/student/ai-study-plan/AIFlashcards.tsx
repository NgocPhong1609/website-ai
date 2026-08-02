"use client";

import React, { useState } from "react";
import { useAIFlashcards } from "@/src/hooks/useAIFlashcards";

export function AIFlashcards() {
  const {
    flashcards,
    currentIndex,
    isFlipped,
    showExplanation,
    selectedOption,
    isGenerating,
    schemaValidated,
    generateFlashcards,
    handleNext,
    handleOptionSelect,
  } = useAIFlashcards();

  const [swipeAnim, setSwipeAnim] = useState<"none" | "left" | "right">("none");
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const currentCard = flashcards[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeAnim(direction);
    if (direction === "right") setKnownCount((c) => c + 1);
    if (direction === "left") setReviewCount((c) => c + 1);

    setTimeout(() => {
      setSwipeAnim("none");
      if (currentIndex < flashcards.length - 1) {
        handleNext();
      } else {
        alert(`🎉 Bạn đã hoàn thành bộ thẻ Flashcard! Đã nắm vững: ${knownCount + (direction === "right" ? 1 : 0)} • Cần ôn thi: ${reviewCount + (direction === "left" ? 1 : 0)}`);
      }
    }, 300);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-black text-lg shadow-2xs">
            🗂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-gray-900">Thẻ ghi nhớ Flashcard Tương tác AI</h3>
              {schemaValidated && (
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Chuẩn AI Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Vuốt phải (<strong className="text-emerald-600">👉</strong>) nếu đã thuộc • Vuốt trái (<strong className="text-red-500">👈</strong>) nếu cần ôn lại
            </p>
          </div>
        </div>

        {/* Real-time Deck Meter */}
        <div className="flex items-center gap-2 font-mono text-xs font-black">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            👉 Đã nhớ: {knownCount}
          </span>
          <span className="px-3 py-1 rounded-xl bg-red-50 text-red-600 border border-red-200">
            👈 Cần ôn lại: {reviewCount}
          </span>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-600">Đang bóc tách khái niệm thuật toán & từ khóa kỹ thuật từ video bài giảng...</p>
        </div>
      )}

      {!isGenerating && flashcards.length > 0 && currentCard && (
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full">
          <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-2">
            <span>Thẻ số {currentIndex + 1} / {flashcards.length}</span>
            <span>Bộ câu hỏi trắc nghiệm tự động</span>
          </div>

          {/* Swipe Card Container */}
          <div
            className={`w-full bg-slate-900 text-white border border-slate-800 rounded-2xl p-7 shadow-sm flex flex-col justify-between min-h-[340px] transition-all duration-300 relative overflow-hidden select-none ${
              swipeAnim === "left"
                ? "-translate-x-28 rotate-[-8deg] opacity-40 bg-red-950/90 border-red-500"
                : swipeAnim === "right"
                ? "translate-x-28 rotate-[8deg] opacity-40 bg-emerald-950/90 border-emerald-500"
                : "translate-x-0 rotate-0"
            }`}
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase bg-white/10 text-indigo-300 border border-white/10">
                Từ khóa Trọng tâm
              </span>
              <span className="text-xs font-bold text-gray-400">Chọn đáp án để lật mặt sau</span>
            </div>

            <h4 className="text-base font-black text-white leading-relaxed mb-6">
              {currentCard.question}
            </h4>

            <div className="flex flex-col gap-2.5 flex-1">
              {currentCard.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentCard.correctAnswer;
                const showResult = isFlipped;

                let borderClass = "border-white/15 bg-white/5 hover:bg-white/10 text-gray-200";
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    borderClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-black shadow-xs";
                    icon = <span className="text-emerald-400 font-black text-xs">✓ Đáp án chính xác</span>;
                  } else if (isSelected && !isCorrect) {
                    borderClass = "border-red-500 bg-red-500/20 text-red-300 font-black";
                    icon = <span className="text-red-400 font-black text-xs">✕ Chưa chính xác</span>;
                  } else {
                    borderClass = "border-white/5 opacity-40 text-gray-500";
                  }
                } else if (isSelected) {
                  borderClass = "border-[#4F46E5] bg-[#4F46E5]/30 text-white font-bold";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showResult}
                    className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${borderClass}`}
                  >
                    <span className="text-xs font-bold">{option}</span>
                    {icon && <span className="shrink-0 ml-3">{icon}</span>}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-5 p-4 rounded-xl bg-black/50 border border-indigo-400/30 backdrop-blur-md animate-fadeIn">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">🤖 Trợ lý AI giải thích chi tiết</p>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {currentCard.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Tinder-Style Swipe Buttons Footer */}
          <div className="flex items-center justify-center gap-8 w-full pt-2">
            <button
              type="button"
              onClick={() => handleSwipe("left")}
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
              title="Vuốt trái: Cần ôn lại"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 shadow-2xs flex items-center justify-center text-2xl font-black transition-all group-hover:scale-105 active:scale-95">
                ✕
              </div>
              <span className="text-xs font-black text-red-600 tracking-wide uppercase">Cần ôn lại</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwipe("right")}
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
              title="Vuốt phải: Đã thuộc"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 shadow-2xs flex items-center justify-center text-2xl font-black transition-all group-hover:scale-105 active:scale-95">
                ♥
              </div>
              <span className="text-xs font-black text-emerald-600 tracking-wide uppercase">Đã làm chủ</span>
            </button>
          </div>
        </div>
      )}

      {!isGenerating && flashcards.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-200 flex flex-col items-center gap-3">
          <span className="text-3xl">✨</span>
          <h4 className="text-base font-black text-gray-900">Bạn đã sẵn sàng chinh phục kiến thức chưa?</h4>
          <p className="text-xs text-gray-500 max-w-md">
            Khởi tạo ngay bộ thẻ học tập trắc nghiệm tự động được bóc tách từ ngữ cảnh video bài giảng bằng Trí tuệ Nhân tạo.
          </p>
          <button
            type="button"
            onClick={generateFlashcards}
            className="mt-2 px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            ⚡ Khởi tạo bộ thẻ Flashcard ngay
          </button>
        </div>
      )}
    </div>
  );
}
