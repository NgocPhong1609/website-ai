import React from "react";
import {
  LightbulbIcon,
  HistoryIcon,
  FileTextIcon,
  PlayCircleIcon,
} from "./icons";

export function ContextPanel() {
  return (
    <div className="w-[320px] lg:w-[380px] h-full overflow-y-auto bg-white border-r border-[#EAEAF4] flex flex-col p-6 lg:p-8 shrink-0">
      {/* Header section */}
      <div className="mb-8">
        <h3 className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-2">
          Lesson Context
        </h3>
        <h1 className="text-2xl font-bold text-[#1A1A2E] leading-tight mb-5">
          Quantum Computing
          <br />
          Fundamentals
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-[#183B56] rounded-full" />
          </div>
          <span className="text-[12px] font-bold text-[#1A1A2E]">
            65% Complete
          </span>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LightbulbIcon className="w-4 h-4 text-[#6B6BFF]" />
          <h2 className="text-[14px] font-bold text-[#1A1A2E]">Key Concepts</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-[#F8F9FB] rounded-xl p-4 transition-colors hover:bg-[#F2F3F7]">
            <h4 className="text-[14px] font-bold text-[#1A1A2E] mb-1">
              Superposition
            </h4>
            <p className="text-[13px] text-[#7878A0] leading-relaxed">
              The ability of a quantum system to be in multiple states
              simultaneously.
            </p>
          </div>
          <div className="bg-[#F8F9FB] rounded-xl p-4 transition-colors hover:bg-[#F2F3F7]">
            <h4 className="text-[14px] font-bold text-[#1A1A2E] mb-1">
              Entanglement
            </h4>
            <p className="text-[13px] text-[#7878A0] leading-relaxed">
              A physical phenomenon where particles become interlinked.
            </p>
          </div>
          <div className="bg-[#F8F9FB] rounded-xl p-4 transition-colors hover:bg-[#F2F3F7]">
            <h4 className="text-[14px] font-bold text-[#1A1A2E] mb-1">
              Qubits
            </h4>
            <p className="text-[13px] text-[#7878A0] leading-relaxed">
              The basic unit of quantum information.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Resources */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <HistoryIcon className="w-4 h-4 text-[#20B2AA]" />
          <h2 className="text-[14px] font-bold text-[#1A1A2E]">
            Recent Resources
          </h2>
        </div>

        <div className="flex flex-col gap-4 pl-2">
          <div className="flex items-center gap-3 cursor-pointer group">
            <FileTextIcon className="w-4 h-4 text-[#A0A0C0] group-hover:text-[#6B6BFF] transition-colors" />
            <span className="text-[13.5px] text-[#4A4B68] group-hover:text-[#1A1A2E] transition-colors">
              Superposition_Draft.pdf
            </span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <PlayCircleIcon className="w-4 h-4 text-[#A0A0C0] group-hover:text-[#6B6BFF] transition-colors" />
            <span className="text-[13.5px] text-[#4A4B68] group-hover:text-[#1A1A2E] transition-colors">
              Visualizing Qubits.mp4
            </span>
          </div>
        </div>
      </div>

      {/* AI Tip (pushed to bottom if enough space, else scroll) */}
      <div className="mt-auto pt-6">
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h3 className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-2">
            AI Tip
          </h3>
          <p className="text-[13px] text-[#7878A0] italic leading-relaxed">
            &quot;Try asking Nova to visualize the Bloch Sphere if the qubit
            concept feels abstract.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
