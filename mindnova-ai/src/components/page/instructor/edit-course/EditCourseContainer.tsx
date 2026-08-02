"use client";

import React from "react";
import { CourseStudio } from "@/src/components/page/instructor/create-course";

interface EditCourseProps {
  courseId?: string;
}

export function EditCourseContainer({ courseId = "c1" }: EditCourseProps) {
  return <CourseStudio mode="edit" courseId={courseId} />;
}
