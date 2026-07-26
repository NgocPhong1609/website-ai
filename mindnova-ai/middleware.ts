import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Đọc accessToken từ Cookie
  const token = request.cookies.get('accessToken')?.value;
  
  // Lấy đường dẫn hiện tại
  const { pathname } = request.nextUrl;

  // Danh sách các route bắt buộc phải đăng nhập
  const protectedRoutes = ['/instructor', '/admin', '/student'];
  
  // Kiểm tra xem đường dẫn hiện tại có bắt đầu bằng một trong các route được bảo vệ không
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Nếu đây là route được bảo vệ mà không có token, chuyển hướng về trang login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Có thể truyền thêm tham số redirect để login xong quay lại trang cũ
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu người dùng đã đăng nhập (có token) mà cố tình vào trang login/register, đẩy về trang chủ hoặc dashboard
  const authRoutes = ['/login', '/register'];
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/instructor/courses', request.url));
  }

  return NextResponse.next();
}

// Cấu hình các đường dẫn mà middleware này sẽ chạy qua
export const config = {
  matcher: [
    '/instructor/:path*',
    '/admin/:path*',
    '/student/:path*',
    '/login',
    '/register'
  ],
};
