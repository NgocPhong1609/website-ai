"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAIGrading } from "@/src/hooks/useAIGrading";
import {
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  LinkIcon,
  QuoteIcon,
  CheckCircleIcon,
  UploadCloudIcon,
  SparklesIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  RefreshCwIcon,
} from "./icons";

// ─── Mock Assignment Data ─────────────────────────────────────────────────────

const ASSIGNMENT = {
  assignmentId: 1,
  title: "Module 4: Semantic Analysis Models",
  courseName: "Neuro-Linguistic Programming",
  deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  maxWordCount: 8000,
  maxFileSize: 25, // MB
  submittedAt: null,
};

const DRAFT_KEY = `assignment_draft_${ASSIGNMENT.assignmentId}`;
const AUTO_SAVE_INTERVAL_MS = 30_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function countChars(text: string): number {
  return text.length;
}

function formatDeadline(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " • " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getDaysRemaining(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AssignmentSubmission() {
  // ── Deadline logic ─────────────────────────────────────────────────────────
  const deadline = new Date(ASSIGNMENT.deadline);
  const isDeadlinePassed = deadline < new Date();
  const daysRemaining = getDaysRemaining(ASSIGNMENT.deadline);

  // ── Draft state ────────────────────────────────────────────────────────────
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem(DRAFT_KEY) ?? "";
    } catch {
      return "";
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(content);
  const charCount = countChars(content);

  // ── Auto-save draft to localStorage every 30s ──────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        localStorage.setItem(DRAFT_KEY, content);
        setLastSaved(new Date());
      } catch {
        // ignore (private browsing etc.)
      }
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [content]);

  // ── AI Grading ────────────────────────────────────────────────────────────
  const { isGrading, gradingResult, gradeSubmission } = useAIGrading({
    instructorRubric: "Develop a 1,500-word critical analysis comparing Word2Vec and Transformer-based embeddings. Address architectural differences in handling polysemy, computational efficiency, and practical case studies.",
    maxScore: 100
  });

  const handleAIGrade = () => {
    if (content.length > 50) {
      gradeSubmission(content);
    } else {
      alert("Please write more content before requesting an AI grade.");
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const handleSaveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, content);
      setLastSaved(new Date());
    } catch {
      // ignore
    }
  }, [content]);

  const handleSubmit = useCallback(async () => {
    // Core rule: Block submission if deadline has passed
    if (isDeadlinePassed) return;
    if (isSubmitting || submitted) return;

    setIsSubmitting(true);

    // Simulate API call: POST /api/assignments/[assignmentId]/submit
    // In production, send { content, fileIds } to the server
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    // Clear draft after successful submission
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }

    setSubmitted(true);
    setIsSubmitting(false);
  }, [isDeadlinePassed, isSubmitting, submitted]);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles).filter(
      (f) => f.size <= ASSIGNMENT.maxFileSize * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Submitted State ──────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="max-w-[1200px] mx-auto w-full p-8 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">Assignment Submitted!</h2>
          <p className="text-[#7878A0] leading-relaxed">
            Your assignment has been successfully submitted. You'll receive feedback from your instructor within 3–5 business days.
          </p>
          <p className="text-[13px] text-[#A0A0C0] mt-4">
            Submitted on {new Date().toLocaleString("en-US")}
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-[1200px] mx-auto w-full p-8 lg:p-10">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#6B6BFF] mb-4">
            <span className="cursor-pointer hover:underline">My Courses</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
            <span className="cursor-pointer hover:underline">{ASSIGNMENT.courseName}</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
            <span className="text-[#1A1A2E]">Assignment Submission</span>
          </div>

          <h1 className="text-3xl font-bold text-[#1A1A2E] leading-tight mb-2">
            {ASSIGNMENT.title}
          </h1>
          <p className="text-[14px] text-[#7878A0]">
            Due Date: {formatDeadline(ASSIGNMENT.deadline)}
          </p>
        </div>

        {/* Status Badge */}
        {isDeadlinePassed ? (
          <div className="flex items-center gap-2 bg-red-50 text-red-500 border border-red-200 px-4 py-2.5 rounded-xl text-[14px] font-bold shrink-0">
            <AlertTriangleIcon className="w-4 h-4" />
            Deadline Passed
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#F0F0FF] text-[#6B6BFF] px-4 py-2.5 rounded-xl text-[14px] font-bold shrink-0">
            <ClockIcon className="w-4 h-4" />
            {daysRemaining} Day{daysRemaining !== 1 ? "s" : ""} Remaining
          </div>
        )}
      </div>

      {/* Deadline Passed Banner */}
      {isDeadlinePassed && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-bold text-red-700">Submission Deadline Has Passed</p>
            <p className="text-[13px] text-red-500 mt-0.5">
              The deadline was {formatDeadline(ASSIGNMENT.deadline)}. You can still view your draft but cannot submit.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Two Columns */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 w-full">

          {/* Assignment Instructions */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileTextIcon className="w-5 h-5 text-[#6B6BFF]" />
              <h2 className="text-[16px] font-bold text-[#1A1A2E]">Assignment Instructions</h2>
            </div>
            <p className="text-[14px] text-[#4A4B68] leading-relaxed mb-4">
              Develop a 1,500-word critical analysis comparing <span className="font-bold">Word2Vec</span> and <span className="font-bold">Transformer-based</span> embeddings. Your response should address the following:
            </p>
            <ul className="list-disc list-inside text-[14px] text-[#4A4B68] space-y-2 mb-6 ml-2">
              <li>Architectural differences in handling polysemy.</li>
              <li>Computational efficiency in large-scale corpora.</li>
              <li>Practical application case study for each model.</li>
            </ul>

            <div className="bg-[#F4FAFA] border-l-4 border-[#20B2AA] rounded-r-xl rounded-l-sm p-4 flex gap-3 items-start">
              <InfoIcon className="w-5 h-5 text-[#20B2AA] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#4A4B68] italic leading-relaxed">
                Ensure all technical terms are defined upon first use. Cite at least 4 peer-reviewed sources from the course reading list.
              </p>
            </div>
          </div>

          {/* Editor Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl flex flex-col shadow-sm overflow-hidden">
            <div className="bg-[#FBFBFC] border-b border-[#EAEAF4] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><BoldIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><ItalicIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><ListIcon className="w-4 h-4" /></button>
                <div className="w-px h-5 bg-[#EAEAF4] mx-1" />
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><LinkIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><QuoteIcon className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase">
                <span className={wordCount > 1500 ? "text-[#EF4444]" : "text-[#A0A0C0]"}>
                  {wordCount} words
                </span>
                {lastSaved && (
                  <span className="flex items-center gap-1.5 text-[#20B2AA]">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Saved {lastSaved.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              disabled={isDeadlinePassed}
              className="w-full p-6 min-h-[300px] text-[15px] text-[#1A1A2E] placeholder-[#A0A0C0] outline-none resize-y disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder={isDeadlinePassed
                ? "Submission deadline has passed. Editing is disabled."
                : "Begin typing your response here... Use professional academic tone."}
            />
          </div>

          {/* File Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={[
              "bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm transition-colors",
              isDraggingOver ? "border-[#6B6BFF] bg-[#F0F0FF]" : "border-[#D0D0E0] hover:border-[#6B6BFF] bg-[#FBFBFC]",
              isDeadlinePassed ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center mb-4">
              <UploadCloudIcon className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-2">Drag & Drop Supplementary Files</h3>
            <p className="text-[13px] text-[#7878A0] mb-6 max-w-sm">
              PDF, DOCX, or ZIP (Max {ASSIGNMENT.maxFileSize}MB). You can also include code repositories.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.zip"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={isDeadlinePassed}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isDeadlinePassed}
              className="px-6 py-2.5 bg-white border border-[#EAEAF4] text-[#4A4B68] font-bold text-[13px] rounded-xl hover:bg-[#F0F0F8] shadow-sm transition-colors disabled:cursor-not-allowed"
            >
              Browse Files
            </button>

            {/* Uploaded files list */}
            {files.length > 0 && (
              <ul className="mt-4 w-full max-w-sm text-left space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-[13px] text-[#4A4B68] bg-[#F0F0F8] rounded-lg px-3 py-2">
                    <span className="truncate flex-1">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="ml-2 text-red-400 hover:text-red-600 shrink-0">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

          {/* AI Pre-Check Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5153DF] text-white flex items-center justify-center shrink-0 shadow-md">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1A2E]">AI Pre-Check</h3>
                <p className="text-[9px] font-bold tracking-widest text-[#6B6BFF] uppercase mt-1">Powered by Nova Core v4</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-[12px] font-bold mb-2">
                <span className="text-[#1A1A2E]">Requirement Matching (AI Estimate)</span>
                <span className="text-[#6B6BFF]">{gradingResult ? `${gradingResult.score}%` : "--"}</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5153DF] to-[#00D2FF] rounded-full transition-all duration-1000" style={{ width: gradingResult ? `${(gradingResult.score / gradingResult.maxScore) * 100}%` : "0%" }} />
              </div>
            </div>

            {gradingResult ? (
              <>
                <div className="h-px bg-[#EAEAF4] w-full mb-6" />
                <div className="flex flex-col gap-5 mb-6">
                  {gradingResult.detailedErrors.map((err, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <AlertTriangleIcon className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[12px] font-bold text-[#4A4B68]">{err.lineOrParagraph}</p>
                        <p className="text-[13px] text-[#4A4B68] leading-relaxed">{err.issue}</p>
                      </div>
                    </div>
                  ))}
                  
                  {gradingResult.correctionHints.map((hint, idx) => (
                    <div key={`hint-${idx}`} className="flex gap-3 items-start">
                      <LightbulbIcon className="w-4 h-4 text-[#6B6BFF] shrink-0 mt-0.5" />
                      <p className="text-[13px] text-[#4A4B68] leading-relaxed">{hint}</p>
                    </div>
                  ))}

                  <div className="mt-2 p-4 bg-[#F8F9FB] border border-[#EAEAF4] rounded-xl text-[13px] text-[#4A4B68] leading-relaxed italic">
                    "{gradingResult.overallFeedback}"
                  </div>
                </div>
              </>
            ) : (
              <div className="h-px bg-[#EAEAF4] w-full mb-6" />
            )}

            <button
              onClick={handleAIGrade}
              disabled={isGrading || isDeadlinePassed}
              className="w-full py-3.5 bg-[#5153DF] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#4648D4] shadow-md transition-colors disabled:opacity-50"
            >
              {isGrading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCwIcon className="w-4 h-4" />
              )}
              {isGrading ? "Analyzing..." : "Refresh AI Analysis"}
            </button>
          </div>

          {/* Submission Details Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between py-3 border-b border-[#EAEAF4]">
              <span className="text-[13px] font-semibold text-[#7878A0]">Word Count</span>
              <span className={`text-[13px] font-bold ${wordCount > 1500 ? "text-[#EF4444]" : "text-[#1A1A2E]"}`}>
                {wordCount.toLocaleString()} words
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#EAEAF4]">
              <span className="text-[13px] font-semibold text-[#7878A0]">Character Count</span>
              <span className="text-[13px] font-bold text-[#1A1A2E]">
                {charCount.toLocaleString()}/{ASSIGNMENT.maxWordCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[13px] font-semibold text-[#7878A0]">Uploaded Files</span>
              <span className="text-[13px] font-bold text-[#1A1A2E]">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            </div>

            {/* Final Submit Button — BLOCKED if deadline passed */}
            <button
              onClick={handleSubmit}
              disabled={isDeadlinePassed || isSubmitting}
              title={isDeadlinePassed ? "Submission deadline has passed" : undefined}
              className="mt-5 w-full py-4 bg-gradient-to-r from-[#5153DF] to-[#6B6BFF] text-white rounded-xl text-[15px] font-bold shadow-[0_4px_14px_rgba(107,107,255,0.35)] hover:shadow-[0_6px_20px_rgba(107,107,255,0.45)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isSubmitting ? "Submitting..." : "Final Submission"}
            </button>

            {isDeadlinePassed && (
              <p className="text-[11px] text-[#EF4444] text-center mt-2 font-semibold">
                ✕ Submission is closed — deadline has passed
              </p>
            )}

            {!isDeadlinePassed && (
              <p className="text-[10px] text-[#A0A0C0] text-center mt-4 leading-relaxed px-2">
                By submitting, you agree to the Academic Integrity Policy and MindNova&apos;s Terms of Service.
              </p>
            )}

            <button
              onClick={handleSaveDraft}
              disabled={isDeadlinePassed}
              className="mt-4 w-full py-3.5 bg-[#F0F0F8] text-[#4A4B68] rounded-xl text-[14px] font-bold hover:bg-[#EAEAF4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2B1B8A] rounded-2xl p-6 text-white overflow-hidden relative shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B6BFF] rounded-full blur-[60px] opacity-40 mix-blend-screen transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00D2FF] rounded-full blur-[50px] opacity-30 mix-blend-screen transform -translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10 flex flex-col justify-end h-32">
              <h3 className="text-[16px] font-bold mb-1.5">Stuck on semantics?</h3>
              <p className="text-[13px] text-[#A0A0C0] font-medium">Ask Nova for a refresher.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
