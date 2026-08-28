import { NextResponse } from "next/server";

export async function POST(req: Request) {
 try {
 const body = await req.json();
 const { goal, currentLevel, timeAvailable } = body;

 // Giả lập xử lý AI mất 2 giây
 await new Promise((resolve) => setTimeout(resolve, 2000));

 // Trả về JSON theo đúng format yêu cầu
 return NextResponse.json({
 phases: [
 {
 phase_name: `Giai đoạn 1: Nền tảng ${goal || "cơ bản"}`,
 description: "Xây dựng kiến thức cốt lõi và các công nghệ nền tảng.",
 courses: [
 { id: 1, title: "Lập trình Căn bản" },
 { id: 2, title: "Cấu trúc dữ liệu và Giải thuật" }
 ]
 },
 {
 phase_name: `Giai đoạn 2: Phát triển chuyên môn (${currentLevel || "Beginner"})`,
 description: `Chuyên sâu vào các kỹ năng thực tế với thời lượng ${timeAvailable || "1-2 tiếng"} mỗi ngày.`,
 courses: [
 { id: 3, title: "Web Fullstack chuyên sâu" },
 { id: 4, title: "Quản trị Cơ sở dữ liệu" }
 ]
 },
 {
 phase_name: "Giai đoạn 3: Dự án thực tế & Triển khai",
 description: "Áp dụng kiến thức vào dự án thực tế, triển khai lên server.",
 courses: [
 { id: 5, title: "Xây dựng dự án đồ án thực tế" }
 ]
 }
 ]
 });
 } catch (error) {
 return NextResponse.json(
 { error: "Đã xảy ra lỗi khi tạo lộ trình" },
 { status: 500 }
 );
 }
}
