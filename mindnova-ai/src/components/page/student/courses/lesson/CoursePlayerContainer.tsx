"use client";

import React from "react";
import { LessonCurriculumSidebar } from "./LessonCurriculumSidebar";
import { LessonView } from "./LessonView";

interface CoursePlayerContainerProps {
  lessonId: string;
}

export function CoursePlayerContainer({ lessonId }: CoursePlayerContainerProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] w-full bg-white relative font-sans">
      {/* Left: Curriculum Navigation Sidebar (Sticky/Fixed width on desktop) */}
      <LessonCurriculumSidebar />

      {/* Right: Interactive Lesson Content & AI Tutor */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F4F8]">
        <LessonView lessonId={lessonId} />
      </div>
    </div>
  );
}
