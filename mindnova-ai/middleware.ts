// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Trong file src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // CẬP NHẬT Ở ĐÂY: Bảo vệ trang chủ "/" thay vì "/dashboard"
  const protectedRoutes = ['/instructor', '/admin']; 
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Chặn truy cập nếu chưa đăng nhập
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu đã login mà vào trang login, đẩy về trang tương ứng
  const authRoutes = ['/login', '/register'];
  if (authRoutes.includes(pathname) && token) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (role === 'instructor') return NextResponse.redirect(new URL('/instructor/courses', request.url));
    return NextResponse.redirect(new URL('/', request.url)); // SỬA Ở ĐÂY: Trỏ về "/"
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/instructor/:path*', '/admin/:path*', '/login', '/register'], // Bỏ /dashboard ở đây
};