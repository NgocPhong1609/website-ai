"use client";

import Image from "next/image";
import Link from "next/link";
import type { AvailableCourse } from "../types";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { GraduationCap, Clock, Flame } from "lucide-react";
interface CourseCatalogViewProps {
 courses: AvailableCourse[];
}

export function CourseCatalogView({ courses }: CourseCatalogViewProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="py-20 px-6 max-w-3xl mx-auto">
        <NoDataAvailable
          icon={GraduationCap}
          title="Bạn đã đăng ký toàn bộ khóa học!"
          description="Tuyệt vời! Bạn đang theo học tất cả các khóa học có sẵn trên hệ thống. Hãy hoàn thành các lộ trình hiện tại hoặc quay lại sau để đón chờ những khóa học mới nhé."
          action={
            <Link
              href="/courses"
              className="px-6 py-3 bg-[#2563eb] text-white rounded-xl font-medium text-sm transition-colors hover:bg-[#1d4ed8] shadow-sm"
            >
              Quay lại khóa học của tôi
            </Link>
          }
        />
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
 <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
 Khám phá <span className=" bg-[#2563eb] bg-clip-text text-transparent">Khóa học mới</span>
 </h1>
 <p className="text-sm text-[#64748b] max-w-2xl leading-relaxed">
 Nâng tầm kỹ năng với các lộ trình đào tạo chuyên sâu được giảng dạy bởi các chuyên gia hàng đầu. Đăng ký ngay hôm nay để mở khóa Lộ trình AI cá nhân hóa.
 </p>
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
 className="group flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-200 transition-all duration-500 hover:-translate-y-1 justify-between h-full"
 >
 {/* Thumbnail */}
 <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
 {safeThumbnailUrl ? (
 <Image
 src={safeThumbnailUrl}
 alt={course.title || "Course thumbnail"}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className="object-cover group-hover:scale-105 transition-transform duration-700"
 />
 ) : (
 <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-80" />
 
 <div className="absolute top-3 left-3 flex gap-2 z-10">
 <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold shadow-sm uppercase tracking-wider flex items-center gap-1">
 <Flame size={12} className="text-orange-500" />
 {course.level === 'beginner' ? 'Cơ bản' : course.level === 'advanced' ? 'Chuyên sâu' : 'Trung cấp'}
 </span>
 </div>
 </div>

 {/* Content */}
 <div className="p-5 flex flex-col flex-1">
 <div className="flex-1">
 <Link href={`/courses/detail?courseId=${course.id}`} className="block focus:outline-none group/title">
 <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover/title:text-blue-600 transition-colors duration-300">
 {course.title}
 </h3>
 </Link>
 <p className="text-sm text-slate-500 line-clamp-2 mt-2.5 leading-relaxed">
 {course.description || "Chưa có mô tả chi tiết cho khóa học này. Hãy đăng ký ngay để khám phá nội dung bên trong!"}
 </p>
 </div>
 
 {/* Logic giá & thời gian đã được gộp mượt mà */}
 <div className="mt-5 bg-slate-50/80 rounded-xl p-3 flex items-center justify-between border border-slate-100/50">
 <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
 <Clock size={14} className="text-slate-400" />
 {course.duration_hours !== undefined ? `${course.duration_hours} giờ` : 'Đang cập nhật'}
 </span>
 <div className="flex flex-col items-end justify-center h-full">
 {Number(course.price) === 0 ? (
 <span className="text-emerald-600 font-bold text-sm leading-none">Miễn phí</span>
 ) : (course.current_price !== undefined && course.price !== undefined && course.current_price < course.price) ? (
 <div className="flex items-center gap-2">
 <span className="text-[10px] text-slate-400 line-through leading-none">
 {Number(course.price).toLocaleString('vi-VN')} đ
 </span>
 <span className="text-blue-600 font-bold text-sm leading-none">
 {Number(course.current_price).toLocaleString('vi-VN')} đ
 </span>
 </div>
 ) : (
 <span className="text-slate-900 font-bold text-sm leading-none">
 {Number(course.price ? course.price : 0).toLocaleString('vi-VN')} đ
 </span>
 )}
 </div>
 </div>
 </div>

 {/* CTA */}
 <div className="px-5 pb-5 pt-0 mt-auto">
 {course.is_enrolled ? (
 <Link
 href={`/courses/lesson?courseId=${course.id}`}
 className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 border border-transparent shadow-sm transition-all cursor-pointer"
 >
 <span>Đã đăng ký - Vào học</span>
 </Link>
 ) : (
 <Link
 href={`/courses/detail?courseId=${course.id}`}
 className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 border border-transparent shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
 >
 <span>Xem chi tiết & Đăng ký</span>
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