import React from "react";
import { UploadIcon, MoreVerticalIcon, SparklesIcon, RobotIcon, SendIcon } from "./icons";

export function ChatPanel() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F7FB]">
      {/* Header */}
      <header className="h-[72px] shrink-0 bg-transparent flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B28CC] to-[#6B6BFF] flex items-center justify-center text-white shadow-md">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A2E] leading-tight">Nova</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-bold tracking-widest text-[#6B6BFF] uppercase">
                AI Tutor Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#A0A0C0]">
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <UploadIcon className="w-5 h-5" />
          </button>
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-8">
        
        {/* Nova Message */}
        <div className="flex gap-4 max-w-[85%]">
          <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
            <RobotIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-gradient-to-br from-[#4143CB] via-[#2A6593] to-[#0C8D89] text-white p-5 rounded-2xl rounded-tl-sm shadow-md">
              <p className="text-[14px] leading-relaxed mb-4">
                Hello Alex! I see you&apos;re diving into the <span className="font-semibold text-[#8EB4FF]">Quantum Computing Fundamentals</span> lesson today. How&apos;s it going?
              </p>
              <p className="text-[14px] leading-relaxed">
                We just finished talking about superposition. Do you want to try a quick thought experiment to solidify that, or shall we move on to entanglement?
              </p>
            </div>
            <span className="text-[11px] text-[#A0A0C0] ml-1">Nova • 10:42 AM</span>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-4 max-w-[85%] self-end">
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-[#5153DF] text-white p-5 rounded-2xl rounded-tr-sm shadow-md">
              <p className="text-[14px] leading-relaxed">
                Hey Nova! Superposition is a bit trippy. Can you explain it again but maybe using a simpler analogy? The &apos;spinning coin&apos; one from the lecture was okay, but I need something more concrete.
              </p>
            </div>
            <span className="text-[11px] text-[#A0A0C0] mr-1">You • 10:44 AM</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden shrink-0 mt-1 border-2 border-white shadow-sm">
            {/* User Avatar Placeholder */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Nova Typing Indicator */}
        <div className="flex gap-4 max-w-[85%]">
          <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
            <RobotIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <div className="bg-white border border-[#EAEAF4] px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 w-fit">
              <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>

      </div>
      
      {/* Input Area (Mock) */}
      <div className="p-6 bg-[#F7F7FB] shrink-0 pb-10">
         <div className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              placeholder="Ask Nova a question..." 
              className="w-full bg-white border border-[#EAEAF4] rounded-full pl-6 pr-14 py-4 text-[14px] shadow-sm focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all"
            />
            <button className="absolute right-3 top-2.5 w-9 h-9 flex items-center justify-center bg-[#6B6BFF] text-white rounded-full hover:bg-[#5153DF] transition-colors shadow-sm focus:outline-none">
               <SendIcon className="w-4 h-4" />
            </button>
         </div>
      </div>

    </div>
  );
}
