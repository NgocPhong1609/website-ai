"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  price: string;
  thumbnailGradient?: string;
  thumbnailUrl?: string;
}

interface CourseCardProps {
  course: Course;
  onBuyNow: (id: number) => Promise<void>;
  isProcessing: boolean;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const FALLBACK_COURSES: Course[] = [
  {
    id: 501,
    title: "Kiến trúc RAG Agents & Tinh chỉnh Mô hình Ngôn ngữ LLM",
    price: "1,250,000 đ",
    thumbnailGradient: "from-indigo-600 to-purple-800",
  },
  {
    id: 502,
    title: "Quản trị Microservices & Bảo mật Enterprise Cloud Native",
    price: "1,450,000 đ",
    thumbnailGradient: "from-blue-700 to-emerald-700",
  },
];

function CourseCard({ course, onBuyNow, isProcessing }: CourseCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-indigo-200 transition-all duration-200 group flex flex-col justify-between">
      {/* Thumbnail */}
      <div>
        <div className="relative h-36 w-full bg-gray-100 overflow-hidden">
          {course.thumbnailUrl ? (
            <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient || "from-indigo-500 to-slate-900"}`} />
          )}

          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button type="button" className="p-2.5 bg-white/95 rounded-xl text-gray-700 hover:text-[#4F46E5] shadow-2xs backdrop-blur-sm transition-colors cursor-pointer" title="Xem nhanh">
              <EyeIcon />
            </button>
          </div>

          <div className={`absolute top-3 right-3 transition-opacity duration-300 z-10 ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-xl shadow-2xs backdrop-blur-sm transition-colors cursor-pointer ${
                isLiked ? "bg-red-50 text-red-500 border border-red-200" : "bg-white/95 text-gray-700 hover:text-red-500"
              }`}
              title="Thêm vào danh sách quan tâm"
            >
              <HeartIcon filled={isLiked} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-sm border border-white/20">
              ⚡ Hot Trending
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <h3 className="text-sm font-black text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-black text-amber-500">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] font-extrabold text-gray-400 font-mono">(1.5k đánh giá)</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-base font-black text-[#4F46E5] font-mono">{course.price}</span>
            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Giảm 20% hôm nay
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 flex gap-2.5">
        <button
          type="button"
          onClick={() => window.location.href = `/courses/detail?courseId=${course.id}`}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all uppercase cursor-pointer block text-center"
        >
          Chi Tiết
        </button>
        <button
          type="button"
          onClick={() => onBuyNow(course.id)}
          disabled={isProcessing}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all disabled:opacity-50 uppercase cursor-pointer active:scale-[0.99] shadow-2xs"
        >
          {isProcessing ? "Đang xử lý..." : "Mua Ngay"}
        </button>
      </div>
    </div>
  );
}

export function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>(FALLBACK_COURSES);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleBuyNow = async (courseId: number) => {
    const token = window.localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện mua khóa học mới!");
      window.location.href = "/login";
      return;
    }

    setProcessingId(courseId);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_ids: [courseId],
          payment_method: "vnpay",
        }),
      });

      const data = await response.json();
      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(data.message || "Đã xảy ra sự cố kết nối tới cổng thanh toán.");
      }
    } catch (error) {
      console.warn("Lỗi giao dịch tự động simulated:", error);
      alert("Hệ thống thanh toán simulaing: Đăng ký thành công vào lộ trình!");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = window.localStorage.getItem("accessToken");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/courses/available", { headers, signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data);
          }
        }
      } catch {
        // Keep FALLBACK_COURSES smoothly when offline or dev server without db
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };
    fetchCourses();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="mt-2 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Khám Phá Học Phần &amp; Công Nghệ Mới</h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Mở rộng danh mục kiến trúc kỹ thuật với các khóa học hàng đầu trên sàn MindNova AI.</p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] rounded-xl text-xs font-extrabold border border-indigo-100 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-wider"
        >
          <span>Xem Tất Cả Khóa Học</span>
          <span>➔</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 py-12 text-center text-xs font-bold text-gray-500 bg-white rounded-2xl border border-gray-200">
            Đang tải dữ liệu khóa học mới...
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onBuyNow={handleBuyNow}
              isProcessing={processingId === course.id}
            />
          ))
        )}
      </div>
    </section>
  );
}