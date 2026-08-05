"use client";

import Image from "next/image";
import Link from "next/link";
import type { AvailableCourse } from "../types";

interface CourseCatalogViewProps {
  courses: AvailableCourse[];
}

export function CourseCatalogView({ courses }: CourseCatalogViewProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-6 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-[#EAEAF4] shadow-sm">
        <div className="w-24 h-24 mb-6 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <span className="text-4xl">🚀</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-3">Bạn đã đăng ký toàn bộ khóa học!</h2>
        <p className="text-sm text-[#64647A] max-w-md leading-relaxed mb-6">
          Tuyệt vời! Bạn đang theo học tất cả các khóa học có sẵn trên hệ thống. Hãy hoàn thành các lộ trình hiện tại hoặc quay lại sau để đón chờ những khóa học mới nhé.
        </p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-[#4648D4] text-white rounded-xl font-medium text-sm transition-colors hover:bg-[#3234a8] shadow-md"
        >
          Quay lại khóa học của tôi
        </Link>
      </div>
    );
  }

  // Hàm phụ trợ để chuẩn hóa URL, tránh lỗi "Invalid URL" của Next.js
  const getValidImageUrl = (url: string | null | undefined) => {
    if (!url || url === "null" || url === "undefined") return null;
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`; // Thêm dấu '/' nếu API trả về đường dẫn thiếu
  };

  return (
    <section className="w-full flex flex-col gap-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Khám phá <span className="bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] bg-clip-text text-transparent">Khóa học mới</span>
          </h1>
          <p className="text-sm text-[#64647A] max-w-2xl leading-relaxed">
            Nâng tầm kỹ năng với các lộ trình đào tạo chuyên sâu được giảng dạy bởi các chuyên gia hàng đầu. Đăng ký ngay hôm nay để mở khóa Lộ trình AI cá nhân hóa.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
           <span className="px-3 py-1.5 rounded-full bg-[#EEF2FF] text-[#4648D4] text-xs font-semibold border border-[#4648D4]/20 shadow-sm">
             {courses.length} Khóa học khả dụng
           </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => {
          // Xử lý link ảnh trước khi render
          const safeThumbnailUrl = getValidImageUrl(course.thumbnail);

          return (
            <div
              key={course.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#EAEAF4] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#5052EE]/40 transition-all duration-300 transform hover:-translate-y-1 justify-between h-full"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
                {safeThumbnailUrl ? (
                  <Image
                    src={safeThumbnailUrl}
                    alt={course.title || "Course thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    {course.level === 'beginner' ? 'Cơ bản' : course.level === 'advanced' ? 'Chuyên sâu' : 'Trung cấp'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div>
                  <Link href={`/courses/detail?courseId=${course.id}`} className="block focus:outline-none">
                    <h3 className="text-lg font-bold text-[#1A1A2E] line-clamp-2 leading-snug group-hover:text-[#4648D4] transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#64647A] line-clamp-2 mt-2 leading-relaxed">
                    {course.description || "Chưa có mô tả chi tiết cho khóa học này."}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs font-semibold text-[#8888A8] border-t border-[#F0F0F8] pt-4 mt-auto">
                  <span className="flex items-center gap-1.5">
                    ⏱️ {course.duration_hours ? `${course.duration_hours} giờ` : 'Đang cập nhật'}
                  </span>
                  <span className="text-[#10B981] flex items-center gap-1">
                     {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5 pt-0 mt-auto">
                {course.is_enrolled ? (
                  <Link
                    href={`/study-plan`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-[#10B981] bg-[#D1FAE5] border border-[#10B981]/30 hover:bg-[#A7F3D0] transition-all"
                  >
                    <span>Đã đăng ký - Vào học</span>
                    <span>➔</span>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/detail?courseId=${course.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-md hover:shadow-lg transition-all hover:opacity-95"
                  >
                    <span>Xem chi tiết & Đăng ký</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}