"use client";

// ─── CourseCard ───────────────────────────────────────────────────────────────
// Individual course card with minimalist white card, crisp border, and indigo actions (Rule #7).

import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { Course } from "../types";
import {
  PencilIcon,
  BookOpenIcon,
  TagIcon,
  ClockIcon,
} from "./icons";

function StatusBadge({ status }: { status: Course["status"] }) {
  const isPublished = status === "published";
  return (
    <span
      className={twMerge(
        "absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide z-10 shadow-2xs",
        isPublished
          ? "bg-emerald-600 text-white"
          : "bg-gray-800 text-white/90",
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function EditButton({ courseId }: { courseId: string }) {
  return (
    <Link
      href={`/instructor/courses/${courseId}/edit`}
      id={`btn-edit-course-${courseId}`}
      aria-label="Chỉnh sửa khóa học"
      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4F46E5] shadow-sm hover:bg-white hover:text-[#4338CA] hover:scale-105 active:scale-95 transition-all duration-150 z-10 cursor-pointer border border-gray-100"
    >
      <PencilIcon />
    </Link>
  );
}

function PriceBadge({ course }: { course: Course }) {
  return (
    <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg text-[13px] font-black z-10 shadow-sm bg-gray-900/80 text-white backdrop-blur-md flex items-center gap-2 border border-white/20">
      {!course.price || course.price === 0 ? (
        <span className="text-emerald-400">Miễn phí</span>
      ) : course.salePrice && course.salePrice < course.price ? (
        <>
          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.salePrice)}</span>
          <span className="text-[11px] text-gray-300 line-through font-medium">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
          </span>
        </>
      ) : (
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</span>
      )}
    </div>
  );
}

function CourseThumbnail({ title, thumbnail }: Pick<Course, "title" | "thumbnail">) {
  return (
    <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden border-b border-gray-100">
      {thumbnail && (
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  );
}

function CourseActionButtons({ courseId }: { courseId: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 p-3.5 mt-auto border-t border-gray-100 bg-gray-50/50">
      <Link
        href={`/instructor/courses/${courseId}/lessons`}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#111827] bg-white border border-gray-200 hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-indigo-200 active:scale-98 transition-all duration-150 cursor-pointer shadow-2xs"
      >
        <span className="text-[#4F46E5]">
          <BookOpenIcon />
        </span>
        <span>Nội dung</span>
      </Link>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article
      aria-label={`Khóa học: ${course.title}`}
      className="group relative flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-2xs h-full"
    >
      <div className="relative">
        <CourseThumbnail title={course.title} thumbnail={course.thumbnail} />
        <StatusBadge status={course.status} />
        <EditButton courseId={course.id} />
        <PriceBadge course={course} />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-[16px] font-bold text-[#111827] line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150 leading-snug">
          {course.title}
        </h3>
        <p className="flex items-center gap-1.5 text-[13px] text-[#6B7280] font-medium mt-auto">
          <span className="text-gray-400"><ClockIcon /></span>
          <span>{course.durationHours} giờ &bull; {course.totalLessons} bài học</span>
        </p>

      </div>

      <CourseActionButtons courseId={course.id} />
    </article>
  );
}