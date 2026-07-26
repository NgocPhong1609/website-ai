"use client";

import React from "react";
import { useAIFlashcards } from "@/src/hooks/useAIFlashcards";

// ─── Component ────────────────────────────────────────────────────────────────
// Client leaf component — all state manipulation is delegated to useAIFlashcards.

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

  const currentCard = flashcards[currentIndex];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-[#1A1A2E]">AI Flashcards</h3>
          {schemaValidated && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200" title="JSON schema contract validated against IAIFlashcard interface">
              ✓ Schema Validated
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={generateFlashcards}
          disabled={isGenerating}
          className="px-3.5 py-1.5 bg-[#F0F0FF] text-[#6B6BFF] text-[12px] font-bold rounded-xl hover:bg-[#EAEAF4] transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Extracting..." : flashcards.length === 0 ? "Generate from Transcript" : "Regenerate"}
        </button>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-[#F8F9FB] rounded-2xl border border-dashed border-[#EAEAF4]">
          <div className="w-6 h-6 border-2 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] font-semibold text-[#7878A0]">Parsing lesson transcript into strict JSON schema...</p>
        </div>
      )}

      {!isGenerating && flashcards.length > 0 && currentCard && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#A0A0C0] uppercase tracking-widest">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>Knowledge Check</span>
          </div>

          <div className="w-full bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm flex flex-col min-h-[280px]">
            <h4 className="text-[15px] font-bold text-[#1A1A2E] leading-relaxed mb-6">
              {currentCard.question}
            </h4>
            
            <div className="flex flex-col gap-3 flex-1">
              {currentCard.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentCard.correctAnswer;
                const showResult = isFlipped;

                let borderClass = "border-[#EAEAF4] hover:border-[#6B6BFF]/40 hover:bg-[#F8F9FB]";
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    borderClass = "border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold";
                    icon = <span className="text-emerald-600 font-bold text-xs">✓ Correct</span>;
                  } else if (isSelected && !isCorrect) {
                    borderClass = "border-red-400 bg-red-50/80 text-red-900";
                    icon = <span className="text-red-600 font-bold text-xs">✕ Incorrect</span>;
                  } else {
                    borderClass = "border-[#EAEAF4] opacity-40";
                  }
                } else if (isSelected) {
                  borderClass = "border-[#6B6BFF] bg-[#F0F0FF]";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showResult}
                    className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-all ${borderClass}`}
                  >
                    <span className="text-[13px] font-medium">{option}</span>
                    {icon && <span className="shrink-0 ml-3">{icon}</span>}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-[#F4F4FF] border border-[#E0E0FC] transition-all">
                <p className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest mb-1.5">AI Explanation</p>
                <p className="text-[13px] text-[#464554] leading-relaxed">
                  {currentCard.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-1 px-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-[13px] font-bold text-[#7878A0] hover:text-[#1A1A2E] disabled:opacity-30 transition-colors"
            >
              ← Previous Card
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="text-[13px] font-bold text-[#7878A0] hover:text-[#1A1A2E] disabled:opacity-30 transition-colors"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {!isGenerating && flashcards.length === 0 && (
        <div className="bg-[#F8F9FB] rounded-2xl p-8 text-center border border-dashed border-[#EAEAF4]">
          <div className="w-10 h-10 rounded-full bg-[#EAEAF4]/60 text-[#6B6BFF] mx-auto mb-2 flex items-center justify-center font-bold text-base">
            ✨
          </div>
          <p className="text-[13px] font-semibold text-[#1A1A2E]">Ready to test your comprehension?</p>
          <p className="text-[12px] text-[#7878A0] mt-1">
            Generate intelligent interactive flashcards parsed directly from the real-time lesson transcript.
          </p>
        </div>
      )}
    </div>
  );
}
