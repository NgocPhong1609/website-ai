import React from "react";
import { Metadata } from "next";
import { EditCourseContainer } from "@/src/components/page/instructor/edit-course";

export const metadata: Metadata = {
  title: "Chỉnh sửa Khóa học — MindNova Instructor Suite",
  description: "Trung tâm tinh chỉnh thông tin cơ bản, cấu trúc chương bài, giá bán và tối ưu SEO cho khóa học bằng AI.",
};

export default function EditCourseGeneralPage() {
  return <EditCourseContainer courseId="c1" />;
}
