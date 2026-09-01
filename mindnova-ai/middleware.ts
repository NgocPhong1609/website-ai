// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isInstructorRoute = pathname.startsWith('/instructor');
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicRoute = isAuthRoute || pathname === '/welcome' || pathname === '/forgot-password';

  // Student routes (everything else that is not auth, instructor, admin, welcome, forgot-password)
  const isStudentRoute = !isAuthRoute && !isInstructorRoute && !isAdminRoute && !isPublicRoute;

  // Normalized roles
  const isTeacherRole = role === 'instructor' || role === 'teacher';
  const isAdminRole = role === 'admin';
  const isStudentRole = role === 'student' || (!isTeacherRole && !isAdminRole);

  // 1. Unauthenticated users:
  if (!token) {
    // Protected student routes requiring authentication
    const protectedStudentPaths = [
      '/courses/lesson',
      '/courses/assignment',
      '/courses/certificates',
      '/practice',
      '/study-plan',
      '/progress',
      '/history',
      '/profile',
      '/billing',
      '/checkout',
      '/payment',
      '/messages',
      '/onboarding',
      '/updated'
    ];

    if (isInstructorRoute || isAdminRoute || protectedStudentPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  // 2. Authenticated users visiting Auth routes (/login, /register):
  if (isAuthRoute) {
    if (isAdminRole) return NextResponse.redirect(new URL('/admin', request.url));
    if (isTeacherRole) return NextResponse.redirect(new URL('/instructor', request.url));
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  // Check if user is previewing a course as instructor
  const isPreviewMode = request.nextUrl.searchParams.get('preview') === 'true';

  // 3. Teacher / Instructor role restrictions:
  if (isTeacherRole) {
    // Teacher MUST remain in /instructor portal ONLY, EXCEPT when previewing a course (preview=true)
    if ((isStudentRoute || isAdminRoute) && !isPreviewMode) {
      return NextResponse.redirect(new URL('/instructor', request.url));
    }
  }

  // 4. Student role restrictions:
  if (isStudentRole) {
    // Student CANNOT access /instructor/* or /admin/*
    if (isInstructorRoute || isAdminRoute) {
      return NextResponse.redirect(new URL('/explore', request.url));
    }
  }

  // 5. Admin role restrictions:
  if (isAdminRole) {
    if (isAdminRoute || isPreviewMode) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};