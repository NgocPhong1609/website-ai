# INSTRUCTOR UI MIGRATION PLAN

## PHASE 1: Audit
Sau quá trình phân tích `instructor_all_code.md` (chứa FE mới) và cấu trúc hiện tại của dự án trên ổ đĩa, dưới đây là kết quả Audit:

### 1. Project hiện tại (Đang chạy / Old UI):
- **Routes**: Nằm tại `app/(instructor)/instructor/...`
- **Components & Logic**: Được cấu trúc theo dạng Feature-sliced design tại `src/features/instructor/...`
- **Data Flow**: Các Container gọi API qua các custom hooks (VD: `useInstructorCourses`, `useCourseStructure`, v.v.), sau đó truyền data xuống các presentational components. Đã tích hợp đầy đủ backend.

### 2. FE mới (Nguồn từ `instructor_all_code.md`):
- **Routes**: Nằm tại `app/(protected)/(instructor)/instructor/...`
- **Components**: Được nhóm lại theo Page-based structure tại `src/components/page/instructor/...`
- **Data Flow**: Sử dụng chủ yếu **Mock Data** (VD: `MOCK_COURSES`) và chưa có logic gọi API thực tế. Tuy nhiên UI/UX rất phong phú, có nhiều hiệu ứng (animations), màu sắc và layout đẹp hơn.

### 3. Đánh giá sự khác biệt:
- **Xung đột Architecture**: FE mới dùng thư mục `src/components/page/instructor` trong khi project hiện hành dùng `src/features/instructor`.
- **Xung đột Route**: FE mới thêm group `(protected)` vào URL structure, trong khi hiện tại đang dùng `(instructor)`.
- **Xung đột Data**: FE mới dùng dữ liệu giả. Project hiện tại dùng dữ liệu thật.

**Quyết định**: Áp dụng **Phương án B (Rebuild UI theo architecture hiện tại)** & **Phương án C (Adapter)**. Cụ thể:
1. **Giữ nguyên Architecture hiện hành**: Vẫn sử dụng `src/features/instructor` và `app/(instructor)/instructor`.
2. **Migration UI Component**: Trích xuất mã nguồn UI (layout, styling, tailwind classes) từ `instructor_all_code.md` sang các component tương ứng ở `src/features/instructor`.
3. **Bảo tồn Data Flow**: Giữ nguyên các custom hook (như `useInstructorCourses`). Nếu cấu trúc props của UI mới yêu cầu dữ liệu khác biệt, ta sẽ viết Adapter để map từ dữ liệu API thực sang dạng hiển thị của UI mới. Tuyệt đối không xài mock data.

---

## PHASE 2: Mapping

| Old Page / Component (Current) | New UI Component (from md file) | Migration Strategy | Risk Level |
|--------------------------------|---------------------------------|--------------------|------------|
| `app/(instructor)/layout.tsx` | `app/(protected)/(instructor)/layout.tsx` | Cập nhật `InstructorSidebar` & `InstructorTopbar` bằng UI mới, giữ nguyên route `app/(instructor)`. | SAFE |
| `src/features/instructor/management` | `src/components/page/instructor/management` | Copy các UI component mới (`CourseCard`, `AIBanner`, `RevenueCard`, v.v.). **Quan trọng:** Sửa `CourseManagementContainer.tsx` UI mới để nhận dữ liệu từ `useInstructorCourses(search)` thay vì `MOCK_COURSES`. | NEEDS_ADAPTER |
| `src/features/instructor/create-course` | `src/components/page/instructor/create-course` | Cập nhật các Step components (BasicInfo, Structure, Settings). Giữ nguyên API `create-course`. | SAFE |
| `src/features/instructor/lesson-management` | `src/components/page/instructor/lesson-management`| Thay đổi giao diện quản lý bài học, giữ nguyên `useCourseStructure` hook. | NEEDS_REFACTOR |
| `src/features/instructor/student-management`| `src/components/page/instructor/student-management`| Gắn UI mới vào API hook học viên cũ. | SAFE |
| `src/features/instructor/analytic` | `src/components/page/instructor/analytic` | Áp dụng UI `AIInsightsTab`, biểu đồ mới với data cũ. | NEEDS_ADAPTER |
| `src/features/instructor/revenue` | `src/components/page/instructor/revenue` | Map dữ liệu doanh thu hiện tại vào UI mới. | SAFE |

---

## Lộ trình Phase 3 (Migration)
Thực hiện tuần tự:
1. Instructor Layout & Sidebar / Topbar
2. Dashboard (Course Management)
3. Create Course
4. Edit Course
5. Lesson Management
6. Các module còn lại (Students, Analytics, Discussions, Pricing, Revenue).
