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

// ─── Sub-component: CourseCard ──────────────────────────────────────────────────
function CourseCard({ course, onBuyNow, isProcessing }: CourseCardProps) {
 const [isLiked, setIsLiked] = useState(false);

 return (
 <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden hover:border-[#B8B0A3] transition-all duration-200 group">
 {/* Thumbnail */}
 <div className="relative h-32 w-full bg-[#F5F0E8] overflow-hidden">
 {course.thumbnailUrl ? (
 <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
 ) : (
 <div className={`w-full h-full bg-[#4A4F5C]`} />
 )}

 {/* Wishlist button (text-based) */}
 <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
 <button 
 onClick={() => setIsLiked(!isLiked)}
 className={`px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm transition-colors ${isLiked ? "bg-[#FADBD8] text-[#C0392B]" : "bg-white/90 text-[#8A8478] hover:text-[#C0392B]"}`}
 title="Wishlist"
 >
 {isLiked ? "Đã thích" : "Thích"}
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="p-4">
 <h3 className="text-[15px] font-bold text-[#2C3039] mb-1 line-clamp-1 font-[family-name:var(--font-playfair-display)]">{course.title}</h3>
 
 {/* Rating (text-based) */}
 <div className="flex items-center gap-1.5 mb-2">
 <span className="text-[13px] font-bold text-[#D4A574]">4.8</span>
 <span className="text-[12px] text-[#B8B0A3]">(1.2k đánh giá)</span>
 </div>

 <p className="flex items-center gap-1.5 text-[15px] font-bold text-[#C0392B] mb-4">
 {course.price}
 </p>

 <div className="flex gap-2">
 <button
 onClick={() => window.location.href = `/courses/${course.id}`}
 className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#2C3039] bg-[#F5F0E8] hover:bg-[#E8E2D9] transition-colors"
 >
 Chi tiết
 </button>
 <button
 onClick={() => onBuyNow(course.id)}
 disabled={isProcessing}
 className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] transition-colors disabled:opacity-50"
 >
 {isProcessing ? "Đang xử lý..." : "Mua ngay"}
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

 const res = await fetch("/api/student/courses/available", { headers });
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
 <h2 className="text-[18px] font-bold text-[#2C3039] font-[family-name:var(--font-playfair-display)]">Explore Courses</h2>
 <Link href="/explore" className="text-[13px] font-semibold text-[#C0392B] hover:underline flex items-center gap-1">
 View All
 </Link>
 </div>

 <div className="grid grid-cols-2 gap-5">
 {isLoading ? (
 <p className="col-span-2 text-center text-sm text-[#B8B0A3]">Đang tải...</p>
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
 <p className="col-span-2 text-center text-sm text-[#B8B0A3]">Hiện không có khóa học mới nào.</p>
 )}
 </div>
 </section>
 );
}