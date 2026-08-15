import { FilteredCoursesView } from "@/src/features/student/courses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses | MindNova AI",
  description: "View and manage your in-progress and completed courses on MindNova AI.",
};

/**
 * React Server Component (RSC) for My Courses Page.
 * Delegates client-side filtering and debounced search to leaf component FilteredCoursesView per Rule #2.
 */
export default function MyCoursesPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
      <FilteredCoursesView />
    </div>
  );
}
