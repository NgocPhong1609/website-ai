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

      <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab === "All";
          return (
            <button
              key={tab}
              type="button"
              className={twMerge(
                "whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-[#4F46E5] text-white shadow-2xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
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
