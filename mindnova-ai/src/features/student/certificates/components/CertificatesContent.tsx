import React from "react";
import {
  UploadIcon,
  ShareIcon,
  PartyPopperIcon,
  ArrowRightIcon,
  VerifiedBadgeIcon,
  GraduationCapIcon,
  StopwatchIcon,
  MedalIcon
} from "./icons";

export function CertificatesContent() {
  return (
    <div className="max-w-6xl mx-auto w-full p-8 lg:p-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-[11px] font-bold tracking-widest text-[#6B6BFF] uppercase mb-2">
            Your Achievements
          </h3>
          <h1 className="text-3xl font-bold text-[#1A1A2E] leading-tight mb-3">
            Certificates &amp; Credentials
          </h1>
          <p className="text-[14px] text-[#7878A0] max-w-2xl leading-relaxed">
            Celebrate your hard work. Here you can find all your verified AI-powered certifications, ready to be shared with the world.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button className="flex items-center gap-2 px-5 py-3 bg-[#F0F0FF] text-[#6B6BFF] rounded-xl text-[14px] font-bold hover:bg-[#EAEAF4] transition-colors shadow-sm">
            <UploadIcon className="w-4 h-4" />
            Export All
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#5153DF] text-white rounded-xl text-[14px] font-bold hover:bg-[#4648D4] transition-colors shadow-md">
            <ShareIcon className="w-4 h-4" />
            Share Portfolio
          </button>
        </div>
      </div>

      {/* Claim Banner */}
      <div className="bg-white border border-[#6B6BFF]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-[#F0F0FF] to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-[#EAEAF4] flex items-center justify-center shrink-0">
            <PartyPopperIcon className="w-8 h-8 text-[#5153DF]" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#1A1A2E] mb-1">Ready to claim!</h2>
            <p className="text-[14px] text-[#7878A0]">
              You&apos;ve completed 100% of <span className="font-bold text-[#1A1A2E]">Neural Networks 101</span>.
            </p>
          </div>
        </div>
        <button className="w-full md:w-auto px-8 py-3.5 bg-[#5153DF] text-white rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-[#4648D4] transition-colors shadow-[0_4px_14px_rgba(107,107,255,0.35)] relative z-10 shrink-0">
          Claim Your Certificate
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          {/* Certificate Preview Graphic */}
          <div className="w-full h-[180px] rounded-xl mb-5 relative bg-gradient-to-br from-[#1A1C23] to-[#0A0B0E] p-2 flex flex-col items-center justify-center shadow-inner overflow-hidden border border-[#2A2C33]">
            <div className="absolute inset-1.5 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-lg pointer-events-none" />
            <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA8A2A]" />
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-1">Mindnova</div>
            <div className="text-[6px] text-gray-400 uppercase tracking-widest mb-3">Certificate of Achievement</div>
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-2" />
            <div className="text-[12px] text-white font-serif">Alex Chen</div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[17px] font-bold text-[#1A1A2E] leading-tight">Next.js Fullstack</h3>
              <VerifiedBadgeIcon className="w-5 h-5 text-[#5153DF] shrink-0 mt-0.5" />
            </div>
            <p className="text-[13px] text-[#A0A0C0] mb-5">Completed on Oct 12, 2023</p>
            
            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">React</span>
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Node.js</span>
              <span className="px-2.5 py-1 bg-[#F0F0FF] text-[#6B6BFF] border border-[#6B6BFF]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Expert</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          {/* Certificate Preview Graphic */}
          <div className="w-full h-[180px] rounded-xl mb-5 relative bg-gradient-to-br from-[#0F3A44] to-[#0A262D] p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden border border-[#164D59]">
            <div className="w-[80%] h-full flex flex-col items-start justify-center">
              <div className="text-[12px] font-bold text-white mb-2">Mindnova AI Academy</div>
              <div className="w-full h-px bg-white/20 mb-3" />
              <div className="text-[14px] text-white/90 font-serif mb-1">Machine Learning Foundations</div>
              <div className="text-[8px] text-white/50 mb-3">Awarded to Alex Chen</div>
              <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#20B2AA] transform rotate-45 opacity-80" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[17px] font-bold text-[#1A1A2E] leading-tight">Machine Learning Foundations</h3>
              <VerifiedBadgeIcon className="w-5 h-5 text-[#5153DF] shrink-0 mt-0.5" />
            </div>
            <p className="text-[13px] text-[#A0A0C0] mb-5">Completed on Aug 05, 2023</p>
            
            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Python</span>
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Scikit-Learn</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          {/* Certificate Preview Graphic */}
          <div className="w-full h-[180px] rounded-xl mb-5 relative bg-[#F8F9FB] p-4 flex flex-col items-center justify-center shadow-inner border border-[#EAEAF4]">
            <div className="w-[85%] h-[85%] bg-white shadow-sm border border-[#EAEAF4] flex flex-col items-center justify-center relative p-3">
              <div className="text-[14px] font-serif text-[#1A1A2E] mb-2 border-b border-[#EAEAF4] pb-1">Alex Chen</div>
              <div className="text-[8px] text-[#7878A0] text-center px-4">Has successfully completed the Advanced UI Design course on MindNova AI.</div>
              {/* Ribbon */}
              <div className="absolute bottom-3 right-3 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#5153DF] border-2 border-white shadow-sm relative z-10" />
                <div className="w-2 h-4 bg-[#6B6BFF] transform -rotate-12 translate-x-1 -translate-y-2 absolute bottom-[-8px] right-2" />
                <div className="w-2 h-4 bg-[#6B6BFF] transform rotate-12 -translate-x-1 -translate-y-2 absolute bottom-[-8px] left-2" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[17px] font-bold text-[#1A1A2E] leading-tight">Advanced UI Design</h3>
              <VerifiedBadgeIcon className="w-5 h-5 text-[#5153DF] shrink-0 mt-0.5" />
            </div>
            <p className="text-[13px] text-[#A0A0C0] mb-5">Completed on June 20, 2023</p>
            
            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Design Systems</span>
              <span className="px-2.5 py-1 bg-[#F4FAFA] text-[#20B2AA] border border-[#20B2AA]/20 rounded-lg text-[10px] font-bold tracking-widest uppercase">Figma</span>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Total Certificates */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 flex items-center gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
            <GraduationCapIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#7878A0] mb-0.5">Total Certificates</p>
            <p className="text-2xl font-bold text-[#1A1A2E]">08</p>
          </div>
        </div>

        {/* Learning Hours */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 flex items-center gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F4FAFA] text-[#20B2AA] flex items-center justify-center shrink-0">
            <StopwatchIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#7878A0] mb-0.5">Learning Hours</p>
            <p className="text-2xl font-bold text-[#1A1A2E]">240h</p>
          </div>
        </div>

        {/* Skill Points */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 flex items-center gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
            <MedalIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#7878A0] mb-0.5">Skill Points</p>
            <p className="text-2xl font-bold text-[#1A1A2E]">1,250</p>
          </div>
        </div>

      </div>

    </div>
  );
}
