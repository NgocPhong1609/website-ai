1.1 Giới thiệu hệ thống
MindNova là nền tảng học tập trực tuyến ứng dụng trí tuệ nhân tạo (AI) nhằm hỗ trợ người học xây dựng lộ trình học tập cá nhân hóa, tương tác với AI Tutor, tham gia các khóa học trực tuyến và đánh giá năng lực học tập.
Hệ thống cho phép:
Học viên tham gia học tập trực tuyến.
Giảng viên xây dựng và kinh doanh khóa học.
AI hỗ trợ học tập và giảng dạy.
Quản trị viên quản lý toàn bộ hệ thống.
Tích hợp thanh toán trực tuyến và dịch vụ thông báo.

1.2 Mục tiêu hệ thống
Cung cấp môi trường học tập trực tuyến hiện đại.
Cá nhân hóa quá trình học bằng AI.
Hỗ trợ giảng viên xây dựng nội dung nhanh chóng.
Quản lý khóa học và doanh thu hiệu quả.
Đảm bảo khả năng mở rộng và bảo mật.

CHƯƠNG 2. PHÂN TÍCH YÊU CẦU HỆ THỐNG
2.1 Danh sách Actor
STT
Actor
Mô tả
1
Guest
Khách truy cập chưa đăng nhập
2
Student
Học viên
3
Instructor
Giảng viên
4
Admin
Quản trị viên
5
AI Service
Hệ thống AI
6
Payment Gateway
Cổng thanh toán
7
Email/Notification Service
Dịch vụ gửi thông báo


2.2 Chức năng theo Actor
2.2.1 Guest
Khám phá
Xem trang chủ
Tìm kiếm khóa học
Xem danh sách khóa học
Xem chi tiết khóa học
Xem đánh giá khóa học
Xem giảng viên
Xem lộ trình học mẫu
Xem demo bài học
Tài khoản
Đăng ký
Đăng nhập
Quên mật khẩu
Đăng nhập Google
AI hỗ trợ
Hỏi AI tư vấn khóa học
Sinh roadmap học tập
Đề xuất khóa học

2.2.2 Student
Quản lý tài khoản
Chỉnh sửa hồ sơ
Đổi mật khẩu
Quản lý avatar
Xem lịch sử học
Học tập
Mua khóa học
Truy cập khóa học
Xem video
Làm quiz
Nộp bài tập
Xem điểm
Theo dõi tiến độ
Nhận chứng chỉ
AI học tập
Chat AI Tutor
Giải thích bài học
Sinh roadmap
Sinh câu hỏi luyện tập
Tóm tắt bài học
Gợi ý bài tiếp theo
Đánh giá năng lực
AI chấm bài
AI sinh flashcard
Thanh toán
Thanh toán khóa học
Xem hóa đơn
Áp mã giảm giá
Yêu cầu hoàn tiền
Tương tác
Đánh giá khóa học
Bình luận bài học
Tham gia thảo luận
Báo lỗi nội dung

2.2.3 Instructor
Quản lý khóa học
Tạo khóa học
Chỉnh sửa khóa học
Upload video
Quản lý bài học
Quản lý chương học
Thiết lập giá
Quản lý học viên
Xem danh sách học viên
Trả lời thảo luận
Theo dõi tiến độ học viên
Gửi thông báo
AI hỗ trợ giảng dạy
Sinh outline khóa học
Sinh quiz
Sinh nội dung bài học
Sinh đề kiểm tra
Gợi ý cải thiện nội dung
Doanh thu
Xem doanh thu
Rút tiền
Xem báo cáo bán hàng

2.2.4 Admin
Người dùng
Quản lý tài khoản
Khóa/Mở tài khoản
Phân quyền
Nội dung
Duyệt khóa học
Gỡ khóa học
Quản lý danh mục
Quản lý banner
AI
Quản lý Prompt
Quản lý AI Model
Theo dõi Token
Giới hạn AI
Xem Log AI
Kinh doanh
Quản lý đơn hàng
Quản lý thanh toán
Quản lý mã giảm giá
Báo cáo doanh thu
Hệ thống
Dashboard
Quản lý cấu hình
Backup dữ liệu
Audit Log


CHƯƠNG 5. THIẾT KẾ MODULE
5.1 Module Authentication
Chức năng:
Đăng ký
Đăng nhập
Đăng nhập Google
Quên mật khẩu
OTP Email

5.2 Module Course Management
Chức năng:
Quản lý khóa học
Quản lý chương học
Quản lý bài học
Quản lý video

5.3 Module Learning
Chức năng:
Học trực tuyến
Quiz
Bài tập
Tiến độ học tập
Chứng chỉ

5.4 Module AI Learning Assistant
Chức năng:
AI Tutor
Roadmap Generator
Flashcard Generator
Quiz Generator
Lesson Summary
Learning Analytics

5.5 Module Payment
Chức năng:
Thanh toán VNPay/Momo
Coupon
Hóa đơn
Hoàn tiền

5.6 Module Notification
Chức năng:
Email
OTP
Thông báo học tập
Thông báo khóa học

CHƯƠNG 6. YÊU CẦU PHI CHỨC NĂNG
Hiệu năng
Hỗ trợ tối thiểu 1.000 người dùng đồng thời.
Thời gian phản hồi dưới 3 giây.
Bảo mật
Mã hóa mật khẩu bằng BCrypt.
Xác thực JWT/Session.
Chống SQL Injection.
Chống XSS.
Phân quyền RBAC.
Khả năng mở rộng
Hỗ trợ Microservice AI trong tương lai.
Dễ dàng tích hợp AI Model mới.
Sao lưu
Backup dữ liệu hằng ngày.
Khôi phục dữ liệu khi sự cố.
