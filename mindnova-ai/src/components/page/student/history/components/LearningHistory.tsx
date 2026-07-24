import React from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  BookIcon,
  TrophyIcon,
  PlayCircleIcon,
  GraduationCapIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  TrendingUpIcon,
  HistoryIcon
} from "./icons";

export function LearningHistory() {
  return (
    <div className="max-w-6xl mx-auto w-full p-8 lg:p-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] leading-tight mb-1.5">
              Learning History
            </h1>
            <p className="text-[14px] text-[#7878A0]">
              A comprehensive record of your academic journey and milestones.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAEAF4] rounded-xl text-[13px] font-semibold text-[#4A4B68] hover:bg-[#F8F9FB] transition-colors shadow-sm">
              <span className="flex items-center gap-1.5">
                <ChevronDownIcon className="w-4 h-4 text-[#A0A0C0]" />
                All Activities
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAEAF4] rounded-xl text-[13px] font-semibold text-[#4A4B68] hover:bg-[#F8F9FB] transition-colors shadow-sm">
              <CalendarIcon className="w-4 h-4 text-[#A0A0C0]" />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#5153DF] text-white rounded-xl text-[13px] font-semibold hover:bg-[#4648D4] transition-colors shadow-md">
              <DownloadIcon className="w-4 h-4" />
              Export Log
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Lessons */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-3">Total Lessons</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-[#1A1A2E]">142</span>
              <span className="text-[14px] font-bold text-[#20B2AA] flex items-center">
                +12%
              </span>
            </div>
          </div>

          {/* Avg Quiz Score */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-3">Avg. Quiz Score</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-[#1A1A2E]">88%</span>
              <TrendingUpIcon className="w-5 h-5 text-[#20B2AA]" />
            </div>
          </div>

          {/* Study Hours */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-3">Study Hours</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-[#1A1A2E]">48.5h</span>
            </div>
          </div>

          {/* AI Proficiency */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-bold tracking-widest text-[#A0A0C0] uppercase mb-3">AI Proficiency</h3>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xl font-bold text-[#6B6BFF]">Level 8</span>
              <div className="w-full h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-[#6B6BFF] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          
          {/* Today */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pl-1">
              <div className="w-7 h-7 rounded-full bg-[#5153DF] flex items-center justify-center text-white shrink-0">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]">Today, Oct 24</h2>
            </div>
            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="bg-white border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
                  <BookIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#8EB4FF] uppercase">Assessment</span>
                    <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                    <span className="text-[11px] font-semibold text-[#A0A0C0]">10:45 AM</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5">Neural Networks Basics Quiz</h4>
                  <p className="text-[13px] text-[#7878A0]">Module 4: Deep Learning Foundations</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A2E]">92/100</div>
                    <div className="text-[12px] text-[#7878A0]">Distinction</div>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-[#EAEAF4] flex items-center justify-center text-[#A0A0C0] hover:text-[#1A1A2E] hover:border-[#D0D0E0] transition-colors">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
                  <TrophyIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#8EB4FF] uppercase">Milestone Reached</span>
                    <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                    <span className="text-[11px] font-semibold text-[#A0A0C0]">09:15 AM</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5">30-Day Learning Streak!</h4>
                  <p className="text-[13px] text-[#7878A0]">You&apos;ve earned the &apos;Consistent Learner&apos; digital badge.</p>
                </div>
                <div className="shrink-0">
                  <button className="px-5 py-2.5 bg-[#5153DF] text-white rounded-xl text-[13px] font-bold hover:bg-[#4648D4] transition-colors shadow-md">
                    Share Achievement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pl-1 text-[#7878A0]">
               <div className="w-7 h-7 rounded-full border border-[#EAEAF4] bg-white flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5" />
               </div>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]">Yesterday, Oct 23</h2>
            </div>
            <div className="flex flex-col gap-3">
              {/* Item 3 */}
              <div className="bg-white border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#EAEAF4] text-[#6B6BFF] flex items-center justify-center shrink-0">
                  <PlayCircleIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#20B2AA] uppercase">Lesson Completed</span>
                    <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                    <span className="text-[11px] font-semibold text-[#A0A0C0]">4:20 PM</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5">Intro to Prompt Engineering</h4>
                  <p className="text-[13px] text-[#7878A0]">Generative AI Elective Track</p>
                </div>
                <div className="shrink-0 w-32 flex flex-col items-end gap-1.5">
                  <div className="flex items-center justify-between w-full text-[11px] font-bold">
                    <span className="text-[#A0A0C0]">Progress</span>
                    <span className="text-[#6B6BFF]">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#6B6BFF] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="bg-white border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#EAEAF4] text-[#6B6BFF] flex items-center justify-center shrink-0">
                  <GraduationCapIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#A0A0C0] uppercase">Course Enrolled</span>
                    <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                    <span className="text-[11px] font-semibold text-[#A0A0C0]">11:00 AM</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5">Advanced Python for Data Science</h4>
                  <p className="text-[13px] text-[#7878A0]">Started your new specialization track.</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-[#A0A0C0]">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-[13px] font-semibold">12 Weeks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earlier this week */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pl-1 text-[#7878A0]">
               <div className="w-7 h-7 rounded-full border border-[#EAEAF4] bg-white flex items-center justify-center shrink-0">
                  <HistoryIcon className="w-3.5 h-3.5" />
               </div>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]">Earlier this week</h2>
            </div>
            <div className="flex flex-col gap-3">
              {/* Item 5 */}
              <div className="bg-[#FBFBFC] border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#EAEAF4] text-[#A0A0C0] flex items-center justify-center shrink-0">
                  <FileTextIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-[14px] font-bold text-[#1A1A2E] mb-0.5">Reading: Ethics in AI</h4>
                  <p className="text-[12px] text-[#A0A0C0]">Oct 21 • 5:10 PM</p>
                </div>
                <div className="shrink-0 text-[#C0C0D0]">
                  <MoreVerticalIcon className="w-5 h-5" />
                </div>
              </div>

              {/* Item 6 */}
              <div className="bg-[#FBFBFC] border border-[#EAEAF4] rounded-2xl p-4 flex items-center gap-5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#EAEAF4] text-[#A0A0C0] flex items-center justify-center shrink-0">
                  <MessageSquareIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-[14px] font-bold text-[#1A1A2E] mb-0.5">Discussion Post: Multi-modal LLMs</h4>
                  <p className="text-[12px] text-[#A0A0C0]">Oct 20 • 2:30 PM</p>
                </div>
                <div className="shrink-0 text-[#C0C0D0]">
                  <MoreVerticalIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-center pb-12">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#EAEAF4] rounded-full text-[13px] font-bold text-[#4A4B68] hover:bg-[#F8F9FB] transition-colors shadow-sm">
              Load More Activities
              <ChevronDownIcon className="w-4 h-4 text-[#A0A0C0]" />
            </button>
          </div>

        </div>
      </div>
  );
}
