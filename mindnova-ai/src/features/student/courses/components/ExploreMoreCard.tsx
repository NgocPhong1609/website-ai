export function ExploreMoreCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center h-full min-h-[380px] hover:border-[#94A3B8] hover:bg-[#F1F5F9] transition-colors cursor-pointer group">
      <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-5 group-hover:bg-[#E0E7FF] transition-colors shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      
      <h3 className="text-[18px] font-bold text-[#111827] mb-2.5">
        Explore More Courses
      </h3>
      <p className="text-[14px] text-[#6B7280] max-w-[220px] mx-auto leading-relaxed">
        Find your next challenge in our AI-curated catalog.
      </p>
    </div>
  );
}
