# MindNova Wiki

Nguồn từ README. Cập nhật khi có thay đổi tính năng.

## Tình trạng

Nhánh `TeacherColor`.

Xong:

- Token student (`#3B82F6`, `#2563EB`, `#EFF6FF`, `#1D4ED8`, `#DBEAFE`, `#60A5FA`) nhúng admin, instructor, student.
- Đỏ brand + `red-*` đổi sang Blue. Hover primary `#2563EB`. Indigo/cyan cũ (`#6B6BFF`, `#4F46E5`) cũng về Blue.
- Tint/shade thiếu thì derive từ primary (blue-100 `#DBEAFE`, blue-400 `#60A5FA`, blue-700 `#1D4ED8`).
- Admin sidebar/topbar/revenue/duyệt khóa: Lucide, bỏ emoji/dingbat.
- Wizard tạo khóa instructor: Lucide thay emoji/SVG hardcode.
- Logout admin/student dùng Blue, không còn `red-*`.
- Gỡ trang admin **AI & System** (`/admin/ai-system`) và API `GET/PUT /api/admin/ai-config`. AI học viên/giáo viên giữ nguyên.
- Admin: đổi **Nội dung** thành **Quản lý khóa học**, gỡ duyệt GV khỏi Users, sidebar tông sáng như Instructor, danh mục admin tạo là đã duyệt, chuỗi chuyên cần theo điểm danh thật.

Sắp làm:

- API admin đầy đủ cho analytics.
- Quiz generator còn vài emoji trong step phụ.
- `rose-*` trên số hoàn tiền admin (semantic âm, không phải brand).

## Quy tắc

- `DESIGN.md` là identity.
- Git bắt buộc.
- Test browser desktop + mobile, có ảnh. Ảnh xóa sau 24h.
- Audit 2 vòng trước khi pass.
- Cập nhật README + wiki mỗi tính năng.

## Liên kết

- App README: `mindnova-ai/README.md`
- Design tokens: `mindnova-ai/DESIGN.md`
