import { CourseCatalogView, getAvailableCourses } from "@/src/features/student/explore";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Explore Courses | MindNova AI",
 description: "Explore and enroll in new AI courses tailored for you.",
};

export default async function ExplorePage() {
 const courses = await getAvailableCourses();

 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
 <CourseCatalogView courses={courses} />
 </div>
 );
}
