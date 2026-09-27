import Link from "next/link";
import { BookOpen, Star, Users } from "lucide-react";
import type { RecommendedCourse } from "../../types";

export function formatCoursePrice(price: number): string {
  return price > 0 ? `${price.toLocaleString("vi-VN")}đ` : "Miễn phí";
}

export function RecommendedCourseCard({ course }: { course: RecommendedCourse }) {
  return (
    <Link
      href={`/courses/detail?courseId=${course.id}`}
      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-blue-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-600">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- thumbnails come from arbitrary storage hosts
          <img src={course.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <BookOpen className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
          {course.title}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
          {course.instructor && <span className="truncate">{course.instructor}</span>}
          {course.rating !== null && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
              {course.rating.toFixed(1)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" aria-hidden />
            {course.students_count} học viên
          </span>
          <span className="font-semibold text-blue-700">{formatCoursePrice(course.price)}</span>
        </span>
      </span>
    </Link>
  );
}
