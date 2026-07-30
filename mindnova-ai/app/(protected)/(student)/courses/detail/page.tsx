import type { Metadata } from "next";
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/courses/detail/page.tsx
import { CourseHeader, CurriculumAccordion, CourseSidebar } from "@/src/components/page/student/courses";
=======
import { CourseHeader, CurriculumAccordion, CourseSidebar } from "@features/student/courses";
>>>>>>> d992cb0ab12794193226d83e3c42b24fadda4c43:mindnova-ai/app/(dashboard)/courses/detail/page.tsx

export const metadata: Metadata = {
  title: "Course Detail | MindNova AI",
  description: "View course curriculum and progress.",
};

export default function CourseDetailPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8">
      {/* Main Content (Left) */}
      <div className="flex-1 w-full min-w-0">
        <CourseHeader />
        <CurriculumAccordion />
      </div>

      {/* Sidebar (Right) */}
      <CourseSidebar />
    </div>
  );
}
