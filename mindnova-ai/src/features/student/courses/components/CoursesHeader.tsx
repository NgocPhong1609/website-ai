import { twMerge } from "tailwind-merge";

const TABS = ["All", "In Progress", "Completed", "Not Started"];

export function CoursesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#111827] tracking-tight leading-tight">
          My Courses
        </h1>
        <p className="text-[15px] text-[#6B7280] mt-1">
          You have 4 courses in progress. Keep up the great work!
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = tab === "All";
          return (
            <button
              key={tab}
              type="button"
              className={twMerge(
                "whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4F46E5]/40",
                isActive
                  ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/20"
                  : "bg-[#EEF2FF] text-[#4B5563] hover:bg-[#E0E7FF] hover:text-[#111827]"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
