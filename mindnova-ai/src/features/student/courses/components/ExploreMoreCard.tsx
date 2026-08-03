import Link from "next/link";
import { getCardClassName } from "@/src/shared/components";

export function ExploreMoreCard() {
  return (
    <Link
      href="/"
      className={getCardClassName({
        variant: "gradient",
        hoverEffect: "lift",
        padding: "xl",
        className: "group border-2 border-dashed border-[#CBD5E1] bg-gradient-to-b from-[#F6F6FB] to-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center h-full min-h-[380px] hover:border-[#6B6BFF] hover:bg-gradient-to-b hover:from-[#EEF2FF]/60 hover:to-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40",
      })}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#4648D4] flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-[#6B6BFF] group-hover:to-[#4648D4] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_16px_rgba(107,107,255,0.35)] group-hover:scale-110 group-hover:rotate-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 group-hover:text-[#4648D4] transition-colors">
        Explore More Courses
      </h3>
      <p className="text-xs sm:text-sm text-[#64647A] max-w-[240px] mx-auto leading-relaxed">
        Discover new challenges in our AI-personalized training catalog and expand your skill stack.
      </p>
      
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#4648D4] bg-white px-4 py-2 rounded-xl border border-[#EAEAF4] shadow-2xs group-hover:bg-[#4648D4] group-hover:text-white group-hover:border-transparent transition-all duration-200">
        <span>Browse Catalog</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
