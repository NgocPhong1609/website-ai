"use client";

import React, { useState } from "react";
import { useAIFlashcards } from "@/src/hooks/useAIFlashcards";

// Client leaf component — all state manipulation is delegated to custom logic + Tinder swipe UX (Section 3.3).

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
    handlePrev,
    handleOptionSelect,
  } = useAIFlashcards();

  const [swipeAnim, setSwipeAnim] = useState<"none" | "left" | "right">("none");
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const currentCard = flashcards[currentIndex];

  // Tinder-style swipe execution (Section 3.3)
  const handleSwipe = (direction: "left" | "right") => {
    setSwipeAnim(direction);
    if (direction === "right") setKnownCount((c) => c + 1);
    if (direction === "left") setReviewCount((c) => c + 1);

    setTimeout(() => {
      setSwipeAnim("none");
      if (currentIndex < flashcards.length - 1) {
        handleNext();
      } else {
        alert(`🎉 Flashcard deck completed! Mastered: ${knownCount + (direction === "right" ? 1 : 0)} • Needs review: ${reviewCount + (direction === "left" ? 1 : 0)}`);
      }
    }, 300);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            🗂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#131B2E]">AI Tinder-Style Flashcards</h3>
              {schemaValidated && (
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  ✓ Schema Verified
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              Swipe right for <strong className="text-emerald-600">&quot;I know this&quot;</strong> • Swipe left for <strong className="text-red-500">&quot;Needs review&quot;</strong>
            </p>
          </div>
        </div>

        {/* Real-time Deck Meter */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            👉 Mastered: {knownCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
            👈 Review: {reviewCount}
          </span>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-[#F8F9FB] rounded-3xl border border-dashed border-gray-200">
          <div className="w-8 h-8 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-600">Extracting algorithmic vocabulary & architectural concepts from video stream...</p>
        </div>
      )}

      {!isGenerating && flashcards.length > 0 && currentCard && (
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full">
          <div className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-wider px-2">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>Interactive Comprehension Deck</span>
          </div>

          {/* Swipe Card Container */}
          <div
            className={`w-full bg-gradient-to-b from-[#1E233E] to-[#121626] text-white border-2 border-indigo-500/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between min-h-[360px] transition-all duration-300 relative overflow-hidden select-none ${
              swipeAnim === "left"
                ? "-translate-x-32 rotate-[-12deg] opacity-20 bg-red-950/80 border-red-500"
                : swipeAnim === "right"
                ? "translate-x-32 rotate-[12deg] opacity-20 bg-emerald-950/80 border-emerald-500"
                : "translate-x-0 rotate-0"
            }`}
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-white/10 text-indigo-300">
                Key Video Term Extraction
              </span>
              <span className="text-xs font-bold text-gray-400">Tap options to flip answer</span>
            </div>

            <h4 className="text-lg font-black text-white leading-relaxed mb-6">
              {currentCard.question}
            </h4>

            <div className="flex flex-col gap-3 flex-1">
              {currentCard.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentCard.correctAnswer;
                const showResult = isFlipped;

                let borderClass = "border-white/15 bg-white/5 hover:bg-white/10 text-gray-200";
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    borderClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-extrabold shadow-sm";
                    icon = <span className="text-emerald-400 font-black text-xs">✓ Correct Answer</span>;
                  } else if (isSelected && !isCorrect) {
                    borderClass = "border-red-500 bg-red-500/20 text-red-300 font-extrabold";
                    icon = <span className="text-red-400 font-black text-xs">✕ Incorrect</span>;
                  } else {
                    borderClass = "border-white/5 opacity-40 text-gray-500";
                  }
                } else if (isSelected) {
                  borderClass = "border-[#6B6BFF] bg-[#6B6BFF]/20 text-white font-bold";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showResult}
                    className={`flex items-center justify-between text-left px-5 py-3.5 rounded-2xl border transition-all ${borderClass}`}
                  >
                    <span className="text-sm font-semibold">{option}</span>
                    {icon && <span className="shrink-0 ml-3">{icon}</span>}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-indigo-400/30 backdrop-blur-md animate-fadeIn">
                <p className="text-[10px] font-black text-[#A5D6FF] uppercase tracking-widest mb-1">🤖 RAG AI Explanation</p>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {currentCard.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Tinder-Style Swipe Buttons Footer (Section 3.3) */}
          <div className="flex items-center justify-center gap-6 w-full pt-2">
            <button
              type="button"
              onClick={() => handleSwipe("left")}
              className="group flex flex-col items-center gap-1 focus:outline-none"
              title="Swipe Left: Needs review"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-200 hover:border-red-500 shadow-md hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)] flex items-center justify-center text-2xl font-black transition-all hover:scale-110 active:scale-95">
                ✕
              </div>
              <span className="text-xs font-black text-red-500 tracking-wide uppercase">Needs Review</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwipe("right")}
              className="group flex flex-col items-center gap-1 focus:outline-none"
              title="Swipe Right: I know this"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border-2 border-emerald-200 hover:border-emerald-500 shadow-md hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] flex items-center justify-center text-2xl font-black transition-all hover:scale-110 active:scale-95">
                ♥
              </div>
              <span className="text-xs font-black text-emerald-600 tracking-wide uppercase">I Know This</span>
            </button>
          </div>
        </div>
      )}

      {!isGenerating && flashcards.length === 0 && (
        <div className="bg-[#F8F9FB] rounded-3xl p-10 text-center border border-dashed border-gray-200 flex flex-col items-center gap-3">
          <span className="text-4xl">✨</span>
          <h4 className="text-base font-black text-[#131B2E]">Ready to memorize core architectural concepts?</h4>
          <p className="text-xs text-gray-500 max-w-md">
            Generate interactive Tinder-style swipe decks extracted directly from video timestamp transcripts.
          </p>
          <button
            type="button"
            onClick={generateFlashcards}
            className="mt-2 px-6 py-3 bg-[#6B6BFF] text-white text-xs font-extrabold rounded-2xl shadow-md hover:bg-[#5249DE] transition-all"
          >
            ⚡ Generate Deck Now
          </button>
        </div>
      )}
    </div>
  );
}
