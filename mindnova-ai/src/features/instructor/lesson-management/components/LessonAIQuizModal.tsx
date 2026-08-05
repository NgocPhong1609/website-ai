"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useAIQuizGenerator, type GeneratedQuestion } from "@/src/hooks/instructor/useAIQuizGenerator";

export interface LessonAIQuizModalProps {
  lessonTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecks?: (questions: GeneratedQuestion[]) => void;
}

// Leaf UI Presentation Component for Section 2.2 Rapid-Review Quiz Interface

export function LessonAIQuizModal({ lessonTitle = "Building Type-Safe Server Actions", isOpen, onClose, onConfirmDecks }: LessonAIQuizModalProps) {
  const {
    isGenerating,
    questions,
    transcriptSource,
    setTranscriptSource,
    generateFromTranscript,
    approveQuestion,
    editQuestion,
    discardQuestion,
    approvedCount,
  } = useAIQuizGenerator();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftQ, setDraftQ] = useState("");
  const [draftA, setDraftA] = useState("");

  if (!isOpen) return null;

  const activeQuestions = questions.filter((q) => q.reviewStatus !== "discarded");

  const startEdit = (q: GeneratedQuestion) => {
    setEditingId(q.id);
    setDraftQ(q.question);
    setDraftA(q.correctAnswer);
  };

  const commitEdit = (id: string) => {
    if (draftQ.trim() && draftA.trim()) {
      editQuestion(id, draftQ.trim(), draftA.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-[0_30px_90px_rgba(0,0,0,0.3)] max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
              🪄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">AI Quiz &amp; Challenge Co-Creator (Section 2.2)</h3>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10">
                  Rapid Review UI
                </span>
              </div>
              <p className="text-xs text-gray-300 font-semibold mt-0.5">
                Target Lesson: <strong className="text-emerald-300">{lessonTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
              ✓ Approved: {approvedCount}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white font-extrabold text-xl transition-colors p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-[#FAF8FF]">
          
          {/* Transcript Source Box */}
          {questions.length === 0 && (
            <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#1A1A2E] flex items-center gap-2">
                  <span>📜 Video Transcript / Lesson Text Source</span>
                </h4>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Auto-populated from upload stream
                </span>
              </div>
              <p className="text-xs text-gray-500">
                The AI analyzes semantic vocabulary, code blocks, and architectural concepts in your text to generate highly accurate assessment rubrics.
              </p>
              <textarea
                value={transcriptSource}
                onChange={(e) => setTranscriptSource(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-2xl border border-indigo-200 bg-[#F8F9FF] text-xs font-medium text-gray-700 leading-relaxed focus:outline-none focus:border-[#6B6BFF] transition-colors"
                placeholder="Paste lesson transcript or markdown notes here..."
              />
              <button
                type="button"
                onClick={() => generateFromTranscript(lessonTitle)}
                disabled={isGenerating || !transcriptSource.trim()}
                className="self-end px-8 py-3 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white text-xs font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isGenerating ? "⚡ Extracting Rubrics..." : "⚡ Generate Diagnostic Quiz Decks Now"}
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <Loader size="md" />
              <h4 className="text-base font-extrabold text-[#1A1A2E]">Analyzing lesson transcript semantics...</h4>
              <p className="text-xs font-semibold text-gray-500 max-w-sm">
                Formulating contextually accurate multiple-choice questions, true/false logic, and practical coding challenges.
              </p>
            </div>
          )}

          {/* Rapid Review Decks */}
          {!isGenerating && activeQuestions.length > 0 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1A1A2E]">Rapid-Review Interface</h4>
                  <p className="text-xs text-gray-500 font-semibold">
                    You retain full editorial control: Click <strong className="text-emerald-600">Approve</strong>, <strong className="text-indigo-600">Edit</strong>, or <strong className="text-red-500">Discard</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => generateFromTranscript(lessonTitle)}
                  className="text-xs font-bold text-[#5153DF] hover:underline"
                >
                  🔄 Regenerate Decks
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {activeQuestions.map((q, idx) => {
                  const isEditing = editingId === q.id;
                  const isApproved = q.reviewStatus === "approved" || q.reviewStatus === "edited";

                  return (
                    <div
                      key={q.id}
                      className={twMerge(
                        "p-6 rounded-3xl bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4",
                        isApproved
                          ? "border-emerald-500/50 bg-emerald-50/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)]"
                          : "border-[#EAEAF4]"
                      )}
                    >
                      {/* Top Tag & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border">
                            {q.type.replace("_", " ")}
                          </span>
                          {isApproved && (
                            <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                              ✓ Approved for Deck
                            </span>
                          )}
                        </div>

                        {/* Rapid-Review Actions Bar (Section 2.2) */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => approveQuestion(q.id)}
                            disabled={isApproved}
                            className={twMerge(
                              "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                              isApproved ? "bg-emerald-500 text-white cursor-default" : "bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200"
                            )}
                          >
                            {isApproved ? "Approved ✓" : "✓ Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => (isEditing ? commitEdit(q.id) : startEdit(q))}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-500 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-extrabold transition-all"
                          >
                            {isEditing ? "Save Edit" : "✎ Edit"}
                          </button>
                          <button
                            type="button"
                            onClick={() => discardQuestion(q.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-extrabold transition-all"
                          >
                            ✕ Discard
                          </button>
                        </div>
                      </div>

                      {/* Question Content */}
                      {isEditing ? (
                        <div className="flex flex-col gap-3 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Question Text</label>
                            <input
                              type="text"
                              value={draftQ}
                              onChange={(e) => setDraftQ(e.target.value)}
                              className="w-full p-3 rounded-xl border border-[#6B6BFF] font-bold text-sm text-[#1A1A2E]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">Correct Answer</label>
                            <input
                              type="text"
                              value={draftA}
                              onChange={(e) => setDraftA(e.target.value)}
                              className="w-full p-3 rounded-xl border border-emerald-500 font-extrabold text-sm text-emerald-700 bg-emerald-50/50"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <h5 className="text-base font-extrabold text-[#1A1A2E] leading-snug">
                            {q.question}
                          </h5>

                          {q.codeSnippet && (
                            <pre className="p-3.5 rounded-2xl bg-[#1E233E] text-indigo-200 font-mono text-xs overflow-x-auto border border-indigo-500/30">
                              <code>{q.codeSnippet}</code>
                            </pre>
                          )}

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-sm text-emerald-800">
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                                ✓
                              </span>
                              <span>Correct Answer: {q.correctAnswer}</span>
                            </div>

                            {q.distractors.map((dist, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500">
                                <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-[10px]">
                                  ✕
                                </span>
                                <span>Distractor {dIdx + 1}: {dist}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-1 p-3 rounded-xl bg-[#F0F0FF] text-xs font-medium text-[#4A4B68]">
                            <strong className="text-[#5153DF]">🤖 AI Pedagogical Rationale:</strong> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isGenerating && questions.length > 0 && activeQuestions.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 flex flex-col items-center gap-3 text-gray-500">
              <span className="text-4xl">🗑️</span>
              <p className="text-sm font-bold text-[#1A1A2E]">All generated questions were discarded.</p>
              <button
                type="button"
                onClick={() => generateFromTranscript(lessonTitle)}
                className="mt-2 px-6 py-2.5 bg-[#6B6BFF] text-white text-xs font-extrabold rounded-2xl shadow-md"
              >
                🔄 Generate New Questions
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-white border-t border-[#EAEAF4] flex items-center justify-between">
          <p className="text-xs font-extrabold text-gray-500">
            Approved decks automatically bind to student interactive practice sessions.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all"
            >
              Close Without Applying
            </button>
            <button
              type="button"
              onClick={() => {
                if (onConfirmDecks) onConfirmDecks(activeQuestions.filter((q) => q.reviewStatus !== "pending"));
                onClose();
              }}
              disabled={approvedCount === 0}
              className="px-6 py-2.5 bg-[#1A1A2E] hover:bg-[#4648D4] text-white text-xs font-black rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              ✓ Save ({approvedCount}) Approved To Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}