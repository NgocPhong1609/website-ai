"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Sub-component ────────────────────────────────────────────────────────────

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

// ─── Sub-component: Icons mới ──────────────────────────────────────────────────
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Sub-component: CourseCard cập nhật ──────────────────────────────────────
function CourseCard({ course, onBuyNow, isProcessing }: CourseCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* Thumbnail */}
      <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
        {course.thumbnailUrl ? (
          <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient || 'from-indigo-400 to-cyan-400'}`} />
        )}

        {/* Nút Preview (Luôn hiện trên hover) */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-[#4F46E5] shadow-sm backdrop-blur-sm" title="Preview">
            <EyeIcon />
          </button>
        </div>

        {/* Nút Wishlist (HIỆN NẾU ĐÃ LIKE HOẶC HOVER) */}
        <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors ${isLiked ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-700 hover:text-red-500"}`}
            title="Wishlist"
          >
            <HeartIcon filled={isLiked} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
  <h3 className="text-[15px] font-bold text-[#111827] mb-1 line-clamp-1">{course.title}</h3>
  
  {/* NEW: Thêm phần Đánh giá Sao (Social Proof) */}
  <div className="flex items-center gap-1.5 mb-2">
    <span className="text-[13px] font-bold text-amber-500">4.8</span>
    <div className="flex text-amber-400">
      {/* Vẽ 5 ngôi sao */}
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-[12px] text-gray-400">(1.2k)</span>
  </div>

  <p className="flex items-center gap-1.5 text-[15px] font-bold text-[#4F46E5] mb-4">
    {course.price}
  </p>

        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = `/courses/${course.id}`}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#111827] bg-[#F4F4FA] hover:bg-[#E4E4EF] transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onBuyNow(course.id)}
            disabled={isProcessing}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Hàm xử lý mua hàng gọi API OrderController
  const handleBuyNow = async (courseId: number) => {
    const token = window.localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để mua khóa học!");
      window.location.href = "/login";
      return;
    }

    setProcessingId(courseId); // Bật loading riêng cho nút này
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          course_ids: [courseId],
          payment_method: "vnpay"
        })
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(data.message || "Có lỗi xảy ra khi tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến hệ thống thanh toán.");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = window.localStorage.getItem("accessToken");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/courses/available", { headers });
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error: unknown) {
        console.error("Lỗi lấy khóa học:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-[#111827]">Explore Courses</h2>
        <Link href="/courses" className="text-[13px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {isLoading ? (
          <p className="col-span-2 text-center text-sm text-gray-500">Đang tải...</p>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onBuyNow={handleBuyNow}
              isProcessing={processingId === course.id}
            />
          ))
        ) : (
          <p className="col-span-2 text-center text-sm text-gray-500">Hiện không có khóa học mới nào.</p>
        )}
      </div>
    </section>
  );
}