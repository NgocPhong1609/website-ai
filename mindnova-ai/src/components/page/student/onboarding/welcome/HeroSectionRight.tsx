import Image from "next/image";
import { memo } from "react";

export default memo(function HeroSectionRight() {
  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center shrink-0 my-6 lg:my-0">
      {/* Ambient glowing aura in background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#6B6BFF]/20 via-[#818CF8]/15 to-[#4CD7F6]/20 rounded-full blur-[60px] pointer-events-none" />

      {/* Hero Image Container with explicit aspect-ratio and reliable bounds for Next Image fill */}
      <div className="relative w-full h-full rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] overflow-hidden bg-gradient-to-tr from-white/30 to-white/70 border border-white/60 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.18)] transition-transform duration-500 hover:scale-[1.01]">
        <Image
          className="object-cover"
          src="/images/computer.png"
          alt="MindNova AI Computer Dashboard"
          fill
          sizes="(max-width: 1024px) 100vw, 540px"
          priority
        />
      </div>

      {/* Floating Interactive Widget 1: AI Autonomous Engine (Top Left) */}
      <div className="absolute top-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-indigo-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center gap-3 z-20">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-xs font-black shadow-inner">
          AI
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#131B2E]">Autonomous Pathing</p>
          <p className="text-[10px] text-[#6B6BFF] font-semibold">Ready to compile</p>
        </div>
      </div>

      {/* Floating Interactive Widget 2: Retention Rate (Bottom Right) */}
      <div className="absolute bottom-6 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-[0_15px_35px_rgba(0,168,150,0.12)] flex items-center gap-3.5 z-20">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 text-lg font-bold">
          📈
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#131B2E]">98.4% Retention</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">Verified over 50k learning logs</p>
        </div>
      </div>

      {/* Floating Interactive Widget 3: Stack Badge (Bottom Left) */}
      <div className="absolute -bottom-4 left-6 sm:left-12 bg-[#1E1E30]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl border border-white/10 shadow-lg text-[11px] font-semibold flex items-center gap-2 z-20">
        <span className="text-[#57DFFE] font-bold">💎</span>
        <span>Tailored to Your Stack</span>
      </div>
    </div>
  );
});
