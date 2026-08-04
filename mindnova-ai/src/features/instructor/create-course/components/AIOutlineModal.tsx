"use client";

import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";

export interface OutlineChapter {
  title: string;
  lessons: string[];
}

export interface GeneratedOutline {
  chapters: OutlineChapter[];
}

export interface AIOutlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (outline: GeneratedOutline) => void;
}

type WizardStep = "params" | "preview";
type GenerationState = "idle" | "loading" | "done" | "error";

export function AIOutlineModal({ isOpen, onClose, onApply }: AIOutlineModalProps) {
  const [step, setStep] = useState<WizardStep>("params");
  const [genState, setGenState] = useState<GenerationState>("idle");

  // Step 1: Course Parameters (Section 2.1)
  const [topic, setTopic] = useState("Fullstack Next.js & Serverless Architectures");
  const [targetAudience, setTargetAudience] = useState("Intermediate Web Developers & Bootcamp Graduates");
  const [skillLevel, setSkillLevel] = useState("Intermediate to Advanced");
  const [methodology, setMethodology] = useState("80/20 Practical Application vs Theoretical Concepts");

  // Step 2: Generated Skeleton Tree
  const [outline, setOutline] = useState<GeneratedOutline>({ chapters: [] });
  const [editingChapterIdx, setEditingChapterIdx] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    setGenState("loading");
    setStep("preview");

    setTimeout(() => {
      const is8020 = methodology.includes("80/20");
      setOutline({
        chapters: [
          {
            title: `Module 1: ${topic} Foundations & Architecture`,
            lessons: [
              "Why this technology matters: Core Paradigms (20% Theory)",
              "Hands-On Lab: Initializing Type-Safe Project Environment (80% Practice)",
              "Live Build: Setting up OAuth Authentication Providers",
            ],
          },
          {
            title: "Module 2: Advanced Edge Caching & Database Connectivity",
            lessons: [
              "RSC vs Client Component Execution Boundaries",
              "Hands-On Workshop: Optimistic UI & React Server Actions",
              "Production Challenge: Connecting PostgreSQL with Drizzle ORM",
            ],
          },
          {
            title: "Module 3: Enterprise Deployment & Observability",
            lessons: [
              "Automated CI/CD Pipelines with GitHub & Vercel",
              "Real-World Case Study: Diagnosing Memory Leaks in Server Actions",
              "Final Capstone Project Architecture Submission",
            ],
          },
        ],
      });
      setGenState("done");
    }, 1800);
  }, [topic, methodology]);

  const handleApply = () => {
    if (onApply && outline.chapters.length > 0) {
      onApply(outline);
    }
    onClose();
  };

  const updateLessonTitle = (cIdx: number, lIdx: number, newTitle: string) => {
    const updated = { ...outline };
    updated.chapters[cIdx].lessons[lIdx] = newTitle;
    setOutline(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1A1A2E] to-[#2B2D62] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#6B6BFF] flex items-center justify-center text-xl font-bold shadow-md">
              🪄
            </span>
            <div>
              <h3 className="text-base font-black text-white">AI Teaching Co-Creator Wizard (Section 2.1)</h3>
              <p className="text-xs text-indigo-200">Architect structured course curriculums based on domain best practices.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-black text-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {step === "params" ? (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                  Course Topic &amp; Core Domain
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5D5FF] text-[#1A1A2E] font-bold text-sm focus:outline-none focus:border-[#6B6BFF] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-1.5">
                    Target Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-[#1A1A2E] bg-white focus:outline-none focus:border-[#6B6BFF]"
                  >
                    <option value="Beginner">Beginner (Foundations)</option>
                    <option value="Intermediate to Advanced">Intermediate to Advanced</option>
                    <option value="Executive Mastery">Executive Mastery</option>
                  </select>
                </div>
              </div>

              {/* Teaching Methodology Selection */}
              <div>
                <label className="block text-xs font-black text-[#1A1A2E] uppercase tracking-wide mb-2">
                  Pedagogical Methodology (Architecture Strategy)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethodology("80/20 Practical Application vs Theoretical Concepts")}
                    className={twMerge(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      methodology.includes("80/20")
                        ? "border-[#6B6BFF] bg-[#F0F0FF] text-[#4648D4] shadow-xs font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <p className="text-xs font-extrabold">🚀 80/20 Practical vs Theory (Recommended)</p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-1">
                      Heavily project-based syllabus; 80% hands-on building &amp; capstone application, 20% fundamental core concepts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethodology("Theoretical Deep-Dive & Academic Analysis")}
                    className={twMerge(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      !methodology.includes("80/20")
                        ? "border-[#6B6BFF] bg-[#F0F0FF] text-[#4648D4] shadow-xs font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <p className="text-xs font-extrabold">🎓 Comprehensive Academic Mastery</p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-1">
                      Deep theoretical immersion with research case studies, algorithmic proofing, and formal architectural defense.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Skeleton Tree Preview & Edit */
            <div className="flex flex-col gap-6 animate-fadeIn">
              {genState === "loading" ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-10 h-10 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
                  <h4 className="text-sm font-extrabold text-[#1A1A2E]">Architecting course outline via best practices...</h4>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Structuring chapters with a strict 80/20 ratio of practical application to theoretical paradigms.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                      ✓ AI Curriculum Tree Generated
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep("params")}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      ← Modify Parameters
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 font-semibold">
                    Review and manually tweak the generated chapters and lesson titles before populating your live builder.
                  </p>

                  <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2">
                    {outline.chapters.map((ch, cIdx) => (
                      <div key={cIdx} className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#EAEAF4] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-black text-[#1A1A2E]">
                            {cIdx + 1}. {ch.title}
                          </h5>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{ch.lessons.length} Lessons</span>
                        </div>

                        <ul className="flex flex-col gap-2">
                          {ch.lessons.map((lessonTitle, lIdx) => (
                            <li key={lIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                              <span className="text-xs text-indigo-500 font-extrabold">🔹</span>
                              <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) => updateLessonTitle(cIdx, lIdx, e.target.value)}
                                className="flex-1 text-xs font-bold text-gray-800 bg-transparent focus:outline-none focus:text-[#6B6BFF]"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#F8F9FF] border-t border-[#EAEAF4] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          {step === "params" ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>✨ Generate Curriculum Tree</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={genState === "loading"}
                className="px-4 py-2 bg-white border border-[#D5D5FF] text-[#4648D4] text-xs font-extrabold rounded-xl hover:bg-[#FAF8FF] transition-all disabled:opacity-50"
              >
                🔄 Regenerate
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={genState === "loading"}
                className="px-6 py-2.5 bg-[#1A1A2E] text-white text-xs font-black rounded-xl shadow-md hover:bg-[#4648D4] transition-all disabled:opacity-50"
              >
                ✓ Apply To Curriculum Builder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}