"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useAIQuizGenerator, type GeneratedQuestion } from "@/src/hooks/instructor/useAIQuizGenerator";
import { Wand2, Trash2 } from "lucide-react";

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
 error,
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
 <div className="bg-white rounded-lg border border-slate-200 shadow-[0_30px_90px_rgba(0,0,0,0.3)] max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Top Header */}
 <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center shadow-md">
 <Wand2 className="h-5 w-5" aria-hidden />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-base font-bold text-white">AI Quiz &amp; Challenge Co-Creator (Section 2.2)</h3>
 <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/10 text-blue-500 border border-white/10">
 Rapid Review UI
 </span>
 </div>
 <p className="text-xs text-slate-300 font-semibold mt-0.5">
 Target Lesson: <strong className="text-slate-50">{lessonTitle}</strong>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-4">
 <span className="px-3 py-1.5 rounded-lg bg-slate-900/20 text-slate-50 border-slate-900/30 text-xs font-bold">
 Approved: {approvedCount}
 </span>
 <button
 type="button"
 onClick={onClose}
 className="text-slate-400 hover:text-white font-semibold text-xl transition-colors p-1"
 >
 
 </button>
 </div>
 </div>

 {/* Modal Content */}
 <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50">
 
 {/* Transcript Source Box */}
 {questions.length === 0 && (
 <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
 <div className="flex flex-col gap-4 animate-fadeIn">
 <div className="flex items-center gap-3">
 
 <span className="text-sm font-bold text-slate-900">Source Material</span>
 </div>
 <p className="text-xs text-slate-500">
 The AI analyzes semantic vocabulary, code blocks, and architectural concepts in your text to generate highly accurate assessment rubrics.
 </p>
 {error && (
 <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg text-xs font-bold">
 {error}
 </div>
 )}
 <textarea
 value={transcriptSource}
 onChange={(e) => setTranscriptSource(e.target.value)}
 rows={5}
 className="w-full p-4 rounded-lg border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 leading-relaxed focus:outline-none focus:border-slate-200 transition-colors"
 placeholder="Paste lesson transcript or markdown notes here..."
 />
 </div>
 <button
 type="button"
 onClick={() => generateFromTranscript(lessonTitle)}
 disabled={isGenerating || !transcriptSource.trim()}
 className="self-end px-8 py-3 bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
 >
 {isGenerating ? " Extracting Rubrics..." : " Generate Diagnostic Quiz Decks Now"}
 </button>
 </div>
 )}

 {isGenerating && (
 <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
 <Loader size="md" />
 <h4 className="text-base font-semibold text-slate-900">Analyzing lesson transcript semantics...</h4>
 <p className="text-xs font-semibold text-slate-500 max-w-sm">
 Formulating contextually accurate multiple-choice questions, true/false logic, and practical coding challenges.
 </p>
 </div>
 )}

 {/* Rapid Review Decks */}
 {!isGenerating && activeQuestions.length > 0 && (
 <div className="flex flex-col gap-5">
 <div className="flex items-center justify-between px-2">
 <div>
 <h4 className="text-sm font-semibold text-slate-900">Rapid-Review Interface</h4>
 <p className="text-xs text-slate-500 font-semibold">
 You retain full editorial control: Click <strong className="text-slate-900">Approve</strong>, <strong className="text-blue-500">Edit</strong>, or <strong className="text-blue-500">Discard</strong>.
 </p>
 </div>
 <button
 type="button"
 onClick={() => generateFromTranscript(lessonTitle)}
 className="text-xs font-bold text-blue-600 hover:underline"
 >
 Regenerate Decks
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
 "p-6 rounded-lg bg-white border-2 transition-all duration-200 shadow-sm flex flex-col gap-4",
 isApproved
 ? "text-slate-900/50 bg-emerald-50/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)]"
 : "border-slate-200"
 )}
 >
 {/* Top Tag & Status */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 font-bold text-xs flex items-center justify-center">
 #{idx + 1}
 </span>
 <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border">
 {q.type.replace("_", " ")}
 </span>
 {isApproved && (
 <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
 Approved for Deck
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
 "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 isApproved ? "text-slate-900 text-white cursor-default" : "bg-emerald-50 hover:bg-slate-900 text-slate-900 hover:text-white border-slate-200"
 )}
 >
 {isApproved ? "Approved " : " Approve"}
 </button>
 <button
 type="button"
 onClick={() => (isEditing ? commitEdit(q.id) : startEdit(q))}
 className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-500 hover:text-white border-slate-200 text-xs font-semibold transition-all"
 >
 {isEditing ? "Save Edit" : " Edit"}
 </button>
 <button
 type="button"
 onClick={() => discardQuestion(q.id)}
 className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 text-xs font-semibold transition-all"
 >
 Discard
 </button>
 </div>
 </div>

 {/* Question Content */}
 {isEditing ? (
 <div className="flex flex-col gap-3 pt-2">
 <div>
 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
 <input
 type="text"
 value={draftQ}
 onChange={(e) => setDraftQ(e.target.value)}
 className="w-full p-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-900"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Correct Answer</label>
 <input
 type="text"
 value={draftA}
 onChange={(e) => setDraftA(e.target.value)}
 className="w-full p-3 rounded-lg border-slate-900 font-semibold text-sm text-slate-900 bg-emerald-50/50"
 />
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <h5 className="text-base font-semibold text-slate-900 leading-snug">
 {q.question}
 </h5>

 {q.codeSnippet && (
 <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-50 font-mono text-xs overflow-x-auto border-blue-500/30">
 <code>{q.codeSnippet}</code>
 </pre>
 )}

 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border-slate-200 font-bold text-sm text-slate-900">
 
 <span>Correct Answer: {q.correctAnswer}</span>
 </div>

 {q.distractors.map((dist, dIdx) => (
 <div key={dIdx} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500">
 
 <span>Distractor {dIdx + 1}: {dist}</span>
 </div>
 ))}
 </div>

 <div className="mt-1 p-3 rounded-lg bg-slate-50 text-xs font-medium text-slate-600">
 <strong className="text-blue-600"> AI Pedagogical Rationale:</strong> {q.explanation}
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
 <div className="p-12 text-center rounded-lg bg-white border border-slate-200 flex flex-col items-center gap-3 text-slate-500">
 <Trash2 className="h-10 w-10 text-slate-300" aria-hidden />
 <p className="text-sm font-bold text-slate-900">All generated questions were discarded.</p>
 <button
 type="button"
 onClick={() => generateFromTranscript(lessonTitle)}
 className="mt-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-md"
 >
 Generate New Questions
 </button>
 </div>
 )}
 </div>

 {/* Modal Footer */}
 <div className="p-4 px-6 bg-white border-t border-slate-200 flex items-center justify-between">
 <p className="text-xs font-semibold text-slate-500">
 Approved decks automatically bind to student interactive practice sessions.
 </p>
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
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
 className="px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 cursor-pointer"
 >
 Save ({approvedCount}) Approved To Lesson
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}