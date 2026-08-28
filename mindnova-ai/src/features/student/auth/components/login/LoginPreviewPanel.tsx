// ─── LoginPreviewPanel ────────────────────────────────────────────────────────
// Decorative right-hand panel. Pure presentational — no state, no logic.

// ─── Sub-cards ────────────────────────────────────────────────────────────────

function LearningVelocityCard() {
 const bars = [28, 40, 32, 52, 44, 60, 68, 55, 74, 88];

 return (
 <div className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(70,72,212,0.1)] border border-white/80">
 <div className="flex items-start justify-between mb-4">
 <div>
 <p className="text-[10px] font-bold text-[#ADADC0] uppercase tracking-[0.12em] mb-1">
 Learning Velocity
 </p>
 <p className="text-[18px] font-extrabold text-[#C0392B] leading-tight">
 Advanced Level
 </p>
 </div>
 
 </div>

 {/* Bar chart */}
 <div className="flex items-end gap-[3px] h-[52px]">
 {bars.map((h, i) => (
 <div
 key={i}
 className="flex-1 rounded-[3px] transition-all"
 style={{
 height: `${h}%`,
 background:
 i >= bars.length - 3
 ? "linear-gradient(to top, #C0392B, #C0392B)"
 : "linear-gradient(to top, #C8CAFF, #DDE0FF)",
 }}
 />
 ))}
 </div>
 </div>
 );
}

function AiTutorCard() {
 return (
 <div className="bg-white rounded-2xl p-4 shadow-[0_4px_24px_rgba(70,72,212,0.08)] border border-white/80">
 <div className="flex items-center gap-2 mb-3">
 
 <span className="text-[10px] font-black text-[#C0392B] uppercase tracking-[0.15em]">
 AI Tutor
 </span>
 </div>
 <p className="text-[11.5px] text-[#4A4A6A] leading-[1.6]">
 &ldquo;I&apos;ve identified a gap in your Quantum Physics modules. Should we focus on
 Wave-Particle Duality next?&rdquo;
 </p>
 </div>
 );
}

function UserStreakCard() {
 return (
 <div className="bg-white rounded-2xl p-4 shadow-[0_4px_24px_rgba(70,72,212,0.08)] border border-white/80 flex items-center gap-3">
 {/* Avatar */}
 <div className="relative shrink-0">
 
 <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full -[#2C3039] border-2 border-white" />
 </div>

 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-bold text-[#2C3039] truncate">Alex Rivera</p>
 <p className="text-[11px] text-[#8A8478] truncate">Masters in AI Ethics</p>
 </div>

 {/* Streak */}
 <div className="shrink-0 from-[#5050E0] rounded-xl px-3.5 py-2.5 text-center shadow-[0_4px_16px_rgba(70,72,212,0.4)]">
 <p className="text-[18px] font-black text-white leading-none">124</p>
 <p className="text-[8px] font-bold text-white/65 uppercase tracking-[0.15em] mt-0.5">
 STREAK
 </p>
 </div>
 </div>
 );
}

function NextSessionCard() {
 return (
 <div className="bg-white rounded-2xl p-4 shadow-[0_4px_24px_rgba(70,72,212,0.08)] border border-white/80 space-y-2.5">
 <p className="text-[9px] font-black text-[#C0C0D8] uppercase tracking-[0.2em]">
 Recommended Focus
 </p>

 {/* Animated progress bar */}
 <div className="h-1 rounded-full bg-[#EAEAF8] overflow-hidden">
 <div
 className="h-full w-[65%] rounded-full animate-progress-fill"
 style={{ background: "linear-gradient(90deg, #C0392B, #C0392B)" }}
 />
 </div>

 <div className="flex items-center gap-2 pt-0.5">
 
 <div>
 <p className="text-[12px] font-bold text-[#2C3039]">Next Session</p>
 <p className="text-[10px] text-[#8A8478]">Today, 4:00 PM</p>
 </div>
 </div>
 </div>
 );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function LoginPreviewPanel() {
 return (
 <div className="relative flex-1 hidden lg:flex flex-col justify-center items-center overflow-hidden from-[#EDEEFF] via-[#F2F3FF] to-[#E6EEFF] px-12 py-12">

 {/* Background glow blobs */}
 <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#FAF7F2] blur-[80px] pointer-events-none" />
 <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#C0392B]/10 blur-[60px] pointer-events-none" />
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#A0A0FF]/5 blur-[80px] pointer-events-none" />

 {/* Heading text above cards */}
 <div className="relative mb-8 text-center">
 <p className="text-xs font-bold text-[#C0392B]/70 uppercase tracking-[0.2em] mb-1">
 Your dashboard preview
 </p>
 <p className="text-[15px] font-bold text-[#2A2A4A] leading-snug">
 Everything you need to accelerate<br />your learning journey
 </p>
 </div>

 {/* Cards grid */}
 <div className="relative w-full max-w-[380px] flex flex-col gap-3">
 {/* Row 1 */}
 <div className="flex gap-3">
 <div className="flex-[1.45] animate-float">
 <LearningVelocityCard />
 </div>
 <div className="flex-1 animate-float-delay">
 <AiTutorCard />
 </div>
 </div>

 {/* Row 2 */}
 <div className="flex gap-3 items-stretch">
 <div className="flex-[1.45] animate-float">
 <UserStreakCard />
 </div>
 <div className="flex-1 animate-float-delay">
 <NextSessionCard />
 </div>
 </div>
 </div>

 {/* Bottom caption */}
 <p className="relative mt-8 text-[11px] text-[#B0B0CC] tracking-wide text-center">
 Powered by MindNova AI · Trusted by 50,000+ learners
 </p>
 </div>
 );
}
