"use client";

import React, { useState, useEffect } from "react";
import {
  LightbulbIcon,
  PlayCircleIcon,
} from "./icons";
import { RoadmapGenerator } from "./RoadmapGenerator";
import { AIFlashcards } from "./AIFlashcards";
import type { ILessonSummary } from "@/src/types/student";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";

export function ContextPanel() {
  const [activeTab, setActiveTab] = useState<"summary" | "roadmap" | "flashcards">("summary");
  const [summary, setSummary] = useState<ILessonSummary | null>(null);

  useEffect(() => {
    // Simulate fetching pre-computed background lesson summary
    setTimeout(() => {
      setSummary({
        lessonId: 101,
        summary: "This lesson introduces the core principles of quantum mechanics applied to computation, specifically focusing on how superposition and entanglement allow qubits to perform complex calculations exponentially faster than classical bits.",
        keyTakeaways: [
          "Superposition allows multiple states simultaneously.",
          "Entanglement links particle states across distances.",
          "Qubits are the fundamental unit of quantum information."
        ],
        nextLessonRecommendation: {
          lessonId: COURSE_DETAIL.nextLessonId || 202,
          title: COURSE_DETAIL.nextLesson || "Quantum Gates",
          reason: "Sequential progression based on curriculum.",
        }
      });
    }, 1000);
  }, []);

  return (
    <div className="w-[320px] lg:w-[400px] h-full overflow-y-auto bg-white border-r border-[#EAEAF4] flex flex-col shrink-0">
      
      {/* Header section */}
      <div className="p-6 lg:p-8 pb-0">
        <h3 className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-2">
          Lesson Context
        </h3>
        <h1 className="text-2xl font-bold text-[#1A1A2E] leading-tight mb-5">
          Quantum Computing
          <br />
          Fundamentals
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-[#183B56] rounded-full" />
          </div>
          <span className="text-[12px] font-bold text-[#1A1A2E]">
            65% Complete
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-6 lg:px-8 border-b border-[#EAEAF4]">
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-3 px-2 text-[13px] font-bold border-b-2 transition-colors ${
            activeTab === "summary" ? "border-[#6B6BFF] text-[#1A1A2E]" : "border-transparent text-[#A0A0C0] hover:text-[#7878A0]"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 px-4 text-[13px] font-bold border-b-2 transition-colors ${
            activeTab === "roadmap" ? "border-[#6B6BFF] text-[#1A1A2E]" : "border-transparent text-[#A0A0C0] hover:text-[#7878A0]"
          }`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`pb-3 px-2 text-[13px] font-bold border-b-2 transition-colors ${
            activeTab === "flashcards" ? "border-[#6B6BFF] text-[#1A1A2E]" : "border-transparent text-[#A0A0C0] hover:text-[#7878A0]"
          }`}
        >
          Flashcards
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-8 flex-1">
        {activeTab === "summary" && (
          <div className="animate-in fade-in duration-300">
             {!summary ? (
                <div className="flex flex-col gap-3">
                   <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse" />
                   <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse" />
                   <div className="h-4 bg-gray-100 rounded-full w-4/6 animate-pulse" />
                </div>
             ) : (
                <>
                   {/* Pre-computed Summary */}
                   <div className="mb-8">
                     <p className="text-[13px] text-[#7878A0] leading-relaxed mb-4">
                       {summary.summary}
                     </p>
                     
                     <div className="flex items-center gap-2 mb-3 mt-6">
                       <LightbulbIcon className="w-4 h-4 text-[#6B6BFF]" />
                       <h2 className="text-[14px] font-bold text-[#1A1A2E]">Key Takeaways</h2>
                     </div>
                     <ul className="flex flex-col gap-2">
                        {summary.keyTakeaways.map((point, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-[13px] text-[#464554] leading-relaxed">
                              <span className="text-[#6B6BFF] shrink-0 mt-0.5">•</span>
                              {point}
                           </li>
                        ))}
                     </ul>
                   </div>

                   {/* Next Lesson Recommendation */}
                   {summary.nextLessonRecommendation && (
                      <div className="bg-[#F8F9FB] rounded-xl p-5 border border-[#EAEAF4]">
                         <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-3">
                            AI Recommendation
                         </h3>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0">
                               <PlayCircleIcon className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div>
                               <h4 className="text-[14px] font-bold text-[#1A1A2E]">
                                  {summary.nextLessonRecommendation.title}
                               </h4>
                               <p className="text-[11px] text-[#7878A0] mt-0.5">
                                  {summary.nextLessonRecommendation.reason}
                               </p>
                            </div>
                         </div>
                      </div>
                   )}
                </>
             )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="animate-in fade-in duration-300">
             <RoadmapGenerator />
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="animate-in fade-in duration-300">
             <AIFlashcards />
          </div>
        )}
      </div>

    </div>
  );
}
