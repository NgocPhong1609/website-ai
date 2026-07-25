import React, { useState } from "react";
import type { IAIFlashcard } from "@/src/types/student";

export function AIFlashcards() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<IAIFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const generateFlashcards = () => {
    setIsGenerating(true);
    setFlashcards([]);
    setIsFlipped(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentIndex(0);

    console.log("[Backend Simulation] Injecting Lesson Transcript into prompt...");
    console.log("[Backend Simulation] Enforcing strict JSON return schema...");

    setTimeout(() => {
      // Simulated strictly parsed JSON from the LLM
      const mockJSONResponse: IAIFlashcard[] = [
        {
          id: "fc-1",
          question: "What is quantum superposition?",
          options: [
            "The ability to spin in multiple directions",
            "The ability of a quantum system to be in multiple states simultaneously",
            "A fast method of data encryption",
            "The collapsing of a quantum wave function"
          ],
          correctAnswer: 1,
          explanation: "Superposition allows a quantum bit (qubit) to exist as a 0, 1, or both simultaneously until it is measured.",
        },
        {
          id: "fc-2",
          question: "Which term describes particles that remain connected so that actions performed on one affect the other?",
          options: [
            "Quantum entanglement",
            "Quantum tunneling",
            "Superposition",
            "Decoherence"
          ],
          correctAnswer: 0,
          explanation: "Entanglement is a phenomenon where entangled particles remain connected such that the state of one instantly influences the other, regardless of distance.",
        }
      ];

      setFlashcards(mockJSONResponse);
      setIsGenerating(false);
    }, 2500);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(idx);
    setIsFlipped(true); // Auto-reveal
    setTimeout(() => setShowExplanation(true), 500);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#1A1A2E]">AI Flashcards</h3>
        <button
          onClick={generateFlashcards}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-[#F0F0FF] text-[#6B6BFF] text-[12px] font-bold rounded-lg hover:bg-[#EAEAF4] transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Extracting..." : flashcards.length === 0 ? "Generate from Transcript" : "Regenerate"}
        </button>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-6 h-6 border-2 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] text-[#7878A0]">Parsing transcript into strict JSON...</p>
        </div>
      )}

      {!isGenerating && flashcards.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#A0A0C0] uppercase tracking-widest">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>Knowledge Check</span>
          </div>

          <div className="perspective-1000 w-full min-h-[300px]">
             {/* Note: We aren't implementing a full CSS 3D transform here to keep it simple, just conditionally rendering */}
            <div className="w-full h-full bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm flex flex-col">
              <h4 className="text-[15px] font-bold text-[#1A1A2E] leading-relaxed mb-6">
                {flashcards[currentIndex].question}
              </h4>
              
              <div className="flex flex-col gap-3 flex-1">
                {flashcards[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === flashcards[currentIndex].correctAnswer;
                  const showResult = isFlipped;

                  let borderClass = "border-[#EAEAF4] hover:border-[#6B6BFF]/30 hover:bg-[#F8F9FB]";
                  let icon = null;

                  if (showResult) {
                     if (isCorrect) {
                        borderClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                        icon = <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>;
                     } else if (isSelected && !isCorrect) {
                        borderClass = "border-red-500 bg-red-50 text-red-800";
                        icon = <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
                     } else {
                        borderClass = "border-[#EAEAF4] opacity-50";
                     }
                  } else if (isSelected) {
                     borderClass = "border-[#6B6BFF] bg-[#F0F0FF]";
                  }

                  return (
                    <button
                      key={idx}
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
                 <div className="mt-6 p-4 rounded-xl bg-[#F0F0FF] border border-[#EAEAF4] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest mb-1">AI Explanation</p>
                    <p className="text-[13px] text-[#464554] leading-relaxed">
                       {flashcards[currentIndex].explanation}
                    </p>
                 </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-[13px] font-bold text-[#7878A0] hover:text-[#1A1A2E] disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="text-[13px] font-bold text-[#7878A0] hover:text-[#1A1A2E] disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!isGenerating && flashcards.length === 0 && (
        <div className="bg-[#F8F9FB] rounded-xl p-6 text-center border border-dashed border-[#EAEAF4]">
          <p className="text-[13px] text-[#7878A0]">
            Generate intelligent flashcards parsed directly from the lesson transcript.
          </p>
        </div>
      )}
    </div>
  );
}
