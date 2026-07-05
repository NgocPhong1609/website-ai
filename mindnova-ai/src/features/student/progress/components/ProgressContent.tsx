import React from "react";
import { ChevronRightIcon, SparklesIcon } from "./icons";

export function ProgressContent() {
  return (
    <div className="max-w-[1200px] mx-auto w-full p-8 lg:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#7878A0] mb-3">
            <span className="cursor-pointer hover:text-[#5153DF] transition-colors">My Courses</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-[#5153DF] font-bold">Learning Progress</span>
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A2E] leading-tight mb-1">
            Advanced Neural Networks
          </h1>
          <p className="text-[14px] text-[#7878A0]">
            Deep Learning Specialization &bull; 4th Generation AI Curriculum
          </p>
        </div>
        
        {/* Header Stats */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-[#1A1A2E]">65%</span>
            <span className="text-[10px] font-bold tracking-widest text-[#A0A0C0] uppercase">Complete</span>
          </div>
          <div className="w-px h-10 bg-[#EAEAF4]" />
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-[#1A1A2E]">14 / 22</span>
            <span className="text-[11px] font-semibold text-[#A0A0C0] uppercase tracking-wide">Lessons</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm">
          <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-2">Total Study Time</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[18px] font-bold text-[#1A1A2E]">12.5 hrs</span>
            <span className="text-[13px] font-bold text-[#20B2AA]">+2.4h this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm">
          <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-2">Quiz Average</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[18px] font-bold text-[#1A1A2E]">88%</span>
            <span className="text-[13px] font-medium text-[#A0A0C0]">Top 5% of class</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm">
          <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-2">Skills Mastered</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[18px] font-bold text-[#1A1A2E]">4/10</span>
            <span className="text-[13px] font-medium text-[#A0A0C0]">Core competencies</span>
          </div>
        </div>

      </div>

      {/* Main Roadmap Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
        
        {/* Left Column - Roadmap */}
        <div className="flex-1 w-full flex flex-col">
          
          {/* Roadmap Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-[15px] font-semibold text-[#4A4B68]">Visual Roadmap</h2>
            <div className="flex items-center bg-white border border-[#EAEAF4] p-1 rounded-full shadow-sm">
              <button className="px-5 py-1.5 rounded-full text-[13px] font-semibold text-[#A0A0C0] hover:text-[#4A4B68] transition-colors">
                Module View
              </button>
              <button className="px-5 py-1.5 rounded-full bg-[#5153DF] text-white text-[13px] font-semibold shadow-md">
                Linear Progression
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-px bg-[#EAEAF4]" />

            <div className="flex flex-col gap-6">
              
              {/* Item 1 - Completed */}
              <div className="relative flex items-center gap-6 group">
                <div className="relative z-10 w-6 h-6 rounded-full bg-[#F7F7FB] flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#20B2AA]" />
                </div>
                <div className="flex-1 flex items-center justify-between py-3 pr-2">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5">Foundations of Deep Learning</h3>
                    <p className="text-[13px] text-[#7878A0]">4 Lessons &bull; Completed</p>
                  </div>
                  <button className="text-[13px] font-bold text-[#20B2AA] hover:text-[#168C86] transition-colors uppercase tracking-wide">
                    Review
                  </button>
                </div>
              </div>

              {/* Item 2 - Active */}
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 w-6 h-6 rounded-full bg-[#E0E0FF] flex items-center justify-center shrink-0 mt-6">
                  <div className="w-3 h-3 rounded-full bg-[#5153DF] shadow-[0_0_0_4px_rgba(81,83,223,0.1)]" />
                </div>
                <div className="flex-1 bg-white border border-[#6B6BFF]/20 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#5153DF] mb-0.5">Optimization Algorithms</h3>
                      <p className="text-[13px] text-[#4A4B68]">Currently on: RMSprop Optimization</p>
                    </div>
                    <button className="px-6 py-2.5 bg-[#5153DF] text-white rounded-xl text-[13px] font-bold shadow-[0_4px_12px_rgba(81,83,223,0.3)] hover:shadow-lg hover:bg-[#4648D4] transition-all shrink-0">
                      CONTINUE
                    </button>
                  </div>
                  <div className="w-64 max-w-full h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
                    <div className="w-[35%] h-full bg-[#5153DF] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Item 3 - Locked */}
              <div className="relative flex items-center gap-6 mt-2">
                <div className="relative z-10 w-6 h-6 rounded-full bg-[#F7F7FB] flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D0D0E0]" />
                </div>
                <div className="flex-1 py-3 pr-2">
                  <h3 className="text-[15px] font-medium text-[#7878A0] mb-0.5">Regularization &amp; Hyperparameters</h3>
                  <p className="text-[13px] text-[#A0A0C0]">6 Lessons &bull; Locked</p>
                </div>
              </div>

              {/* Item 4 - Locked */}
              <div className="relative flex items-center gap-6 mt-2">
                <div className="relative z-10 w-6 h-6 rounded-full bg-[#F7F7FB] flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D0D0E0]" />
                </div>
                <div className="flex-1 py-3 pr-2">
                  <h3 className="text-[15px] font-medium text-[#7878A0] mb-0.5">Sequence Models &amp; RNNs</h3>
                  <p className="text-[13px] text-[#A0A0C0]">8 Lessons &bull; Locked</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1A1A2E]">Nova&apos;s Insights</h3>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-bold tracking-widest text-[#20B2AA] uppercase mb-2">Priority Review</h4>
              <p className="text-[13.5px] text-[#4A4B68] leading-relaxed">
                Backpropagation calculus is key for the next chapter. <span className="text-[#5153DF] font-semibold hover:underline cursor-pointer">Open lesson</span>
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-2">Next Milestone</h4>
              <p className="text-[13.5px] text-[#4A4B68] leading-relaxed">
                Complete Module 2 Quiz to boost retention by 40%.
              </p>
            </div>

            <div className="h-px bg-[#EAEAF4] w-full my-6" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#7878A0]">Streak</span>
                <span className="text-[14px] font-bold text-[#1A1A2E]">5 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#7878A0]">Score</span>
                <span className="text-[14px] font-bold text-[#10B981]">A+</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
