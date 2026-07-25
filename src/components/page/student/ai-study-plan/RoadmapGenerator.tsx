import React, { useState, useEffect } from "react";
import type { IRoadmapNode } from "@/src/types/student";

export function RoadmapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmapNode[]>([]);

  const generateRoadmap = () => {
    setIsGenerating(true);
    setRoadmap([]);

    console.log("[Backend Simulation] Analyzing Competency Assessment and Learning Goals...");
    console.log("[Backend Simulation] Mapping missing skills to Course Metadata tags...");

    setTimeout(() => {
      setRoadmap([
        {
          id: "node-1",
          courseTitle: "React Fundamentals",
          targetSkill: "Component State & Props",
          isCompleted: true,
          isCurrent: false,
          isLocked: false,
        },
        {
          id: "node-2",
          courseTitle: "Next.js App Router Basics",
          targetSkill: "Server Components",
          isCompleted: false,
          isCurrent: true,
          isLocked: false,
        },
        {
          id: "node-3",
          courseTitle: "Advanced Data Fetching",
          targetSkill: "Caching & Revalidation",
          isCompleted: false,
          isCurrent: false,
          isLocked: true,
        },
        {
          id: "node-4",
          courseTitle: "Fullstack Architecture",
          targetSkill: "Route Handlers & Middleware",
          isCompleted: false,
          isCurrent: false,
          isLocked: true,
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#1A1A2E]">Learning Roadmap</h3>
        <button
          onClick={generateRoadmap}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-[#F0F0FF] text-[#6B6BFF] text-[12px] font-bold rounded-lg hover:bg-[#EAEAF4] transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : roadmap.length === 0 ? "Generate Roadmap" : "Regenerate"}
        </button>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-6 h-6 border-2 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] text-[#7878A0]">Mapping your missing skills...</p>
        </div>
      )}

      {!isGenerating && roadmap.length > 0 && (
        <div className="relative pl-6 py-2">
          {/* Vertical line connecting nodes */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-[#EAEAF4]" />

          <div className="flex flex-col gap-6">
            {roadmap.map((node, idx) => (
              <div key={node.id} className="relative flex items-start gap-4">
                {/* Node circle */}
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                    node.isCompleted
                      ? "border-emerald-500 text-emerald-500"
                      : node.isCurrent
                      ? "border-[#6B6BFF] text-[#6B6BFF]"
                      : "border-[#EAEAF4] text-[#EAEAF4]"
                  }`}
                  style={{ top: "4px" }}
                >
                  {node.isCompleted && (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {node.isCurrent && <div className="w-2 h-2 bg-[#6B6BFF] rounded-full" />}
                </div>

                <div className={`flex-1 p-4 rounded-xl border ${node.isCurrent ? "bg-[#F0F0FF] border-[#6B6BFF]/20" : "bg-white border-[#EAEAF4]"} ${node.isLocked ? "opacity-60" : ""}`}>
                  <p className="text-[10px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-1">
                    Target Skill: {node.targetSkill}
                  </p>
                  <h4 className={`text-[14px] font-bold ${node.isLocked ? "text-[#7878A0]" : "text-[#1A1A2E]"}`}>
                    {node.courseTitle}
                  </h4>
                  {node.isLocked && (
                     <div className="mt-2 text-[11px] font-medium text-[#7878A0] flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                           <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Locked
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isGenerating && roadmap.length === 0 && (
        <div className="bg-[#F8F9FB] rounded-xl p-6 text-center border border-dashed border-[#EAEAF4]">
          <p className="text-[13px] text-[#7878A0]">
            Click "Generate Roadmap" to build a personalized learning path based on your latest competency assessment.
          </p>
        </div>
      )}
    </div>
  );
}
