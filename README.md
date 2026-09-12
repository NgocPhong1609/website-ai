# website-ai

MindNova: student + instructor + admin.

## Tình trạng hiện tại

Nhánh `TeacherColor`: đồng bộ màu student Blue cho cả dự án, admin dùng Lucide, gỡ icon unicode thừa.

Chi tiết: `mindnova-ai/README.md`, `mindnova-ai/DESIGN.md`, `wiki/Home.md`.

## Quy tắc làm việc

- Xưng hô em với anh.
- Superpowers + Karpathy: nghĩ trước, code tối giản, đúng phạm vi, kiểm chứng thật.
- Git bắt buộc.
- UI bám DESIGN.md. Test browser desktop + mobile, gửi ảnh. Ảnh xóa sau 24h.
- Audit / review / stress 2 vòng mới được báo pass. Không đoán.
- Xong hệ thống/tính năng: cập nhật README + wiki.

## Hướng dẫn GitHub



1
git clone https://github.com/NgocPhong1609/website-ai.git


cd website-ai

2
Tạo branch riêng để làm việc:
git checkout -b feature/[ten-thanh-vien]

3
Làm việc và commit trên branch đó:
git add .
git commit -m "Thêm chức năng đăng nhập"

4
Push branch của bạn lên GitHub:
git push origin feature/[ten-branch]

5
Tạo Pull Request (PR) để merge vào main

Sau khi push xong, truy cập GitHub repository → bạn sẽ thấy thông báo gợi ý tạo Pull Request.

Hoặc vào thủ công:

Vào tab "Pull requests" → "New pull request"

Chọn:

base branch: main

compare branch: feature/[ten-branch-cua-ban]

Nhập mô tả thay đổi → Create pull request

Người quản lý dự án sẽ review và merge vào main.

6

Cập nhật code mới nhất từ main (khi cần)

Khi branch main có thay đổi, bạn nên cập nhật về branch của mình để tránh lỗi conflict:

git checkout main  // chuyển sang nhánh main
git pull origin main   // lấy code hiện tại từ main
git checkout feature/[ten-branch]  // chuyển về nhánh của mình