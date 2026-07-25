# website-ai
# Hướng dẫn GitHub


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