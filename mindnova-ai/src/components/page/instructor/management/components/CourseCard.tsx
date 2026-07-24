"use client";

// ─── CourseCard ───────────────────────────────────────────────────────────────
// Individual course card with thumbnail, status badge, action buttons.

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { Course } from "../types";
import {
  PencilIcon,
  UploadIcon,
  BookOpenIcon,
  LayersIcon,
  TagIcon,
  ClockIcon,
} from "./icons";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Course["status"] }) {
  const isPublished = status === "published";
  return (
    <span
      className={twMerge(
        "absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide z-10",
        isPublished
          ? "bg-emerald-500/90 text-white backdrop-blur-sm"
          : "bg-[#1A1A2E]/70 text-white/90 backdrop-blur-sm",
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

// ─── Edit Button ─────────────────────────────────────────────────────────────

function EditButton({ courseId }: { courseId: string }) {
  return (
    <button
      type="button"
      id={`btn-edit-course-${courseId}`}
      aria-label="Chỉnh sửa khóa học"
      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4648D4] shadow-sm hover:bg-white hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-150 z-10"
    >
      <PencilIcon />
    </button>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function CourseThumbnail({ title, thumbnail }: Pick<Course, "title" | "thumbnail">) {
  if (!thumbnail) return null;

  return (
    <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[#4648D4]/20 to-[#6B6BFF]/20 overflow-hidden">
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        onError={(e) => {
          // Graceful fallback to gradient placeholder
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/30 via-transparent to-transparent" />
    </div>
  );
}

// ─── Action Buttons Row ───────────────────────────────────────────────────────

interface ActionBtn {
  id: string;
  label: string;
  Icon: React.FC;
}

function CourseActionButtons({ courseId }: { courseId: string }) {
  const ACTIONS: ActionBtn[] = [
    { id: `btn-upload-${courseId}`, label: "Upload", Icon: UploadIcon },
    { id: `btn-lessons-${courseId}`, label: "Bài học", Icon: BookOpenIcon },
    { id: `btn-curriculum-${courseId}`, label: "Chương học", Icon: LayersIcon },
    { id: `btn-pricing-${courseId}`, label: "Đặt giá", Icon: TagIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-4 pt-0">
      {ACTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          id={id}
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#64647A] bg-[#F6F6FB] border border-[#EAEAF4] hover:bg-[#EEF0FF] hover:text-[#4648D4] hover:border-[#C5C6FF] active:scale-95 transition-all duration-150"
        >
          <span className="text-[#9090B0]">
            <Icon />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main CourseCard ──────────────────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article
      aria-label={`Khóa học: ${course.title}`}
      className="group relative flex flex-col rounded-2xl bg-white border border-[#EAEAF4] overflow-hidden hover:border-[#C5C6FF] hover:shadow-[0_8px_30px_rgba(107,107,255,0.12)] transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative">
        <CourseThumbnail title={course.title} thumbnail={course.thumbnail} />
        <StatusBadge status={course.status} />
        <EditButton courseId={course.id} />
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-1 flex flex-col gap-1">
        <h3 className="text-[14px] font-semibold text-[#1A1A2E] line-clamp-2 group-hover:text-[#4648D4] transition-colors duration-150">
          {course.title}
        </h3>
        <p className="flex items-center gap-1 text-[12px] text-[#9090B0]">
          <ClockIcon />
          {course.durationHours} giờ · {course.totalLessons} bài học
        </p>
      </div>

      {/* Actions */}
      <CourseActionButtons courseId={course.id} />
    </article>
  );
}
