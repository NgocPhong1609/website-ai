import {
  CoursesHeader,
  ExploreMoreCard,
  MY_COURSES,
  MyCourseCard,
} from "@/src/features/student/courses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses | MindNova AI",
  description:
    "View and manage your in-progress and completed courses on MindNova AI.",
};

export default function MyCoursesPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
      <CoursesHeader />

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {MY_COURSES.map((course) => (
          <MyCourseCard key={course.id} course={course} />
        ))}
        <ExploreMoreCard />
      </div>
    </div>
  );
}
