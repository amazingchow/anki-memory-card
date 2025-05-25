import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const isPublicPage = request.nextUrl.pathname.startsWith('/terms') ||
                      request.nextUrl.pathname.startsWith('/privacy');

  // Allow access to public pages without authentication
  if (isPublicPage) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/cards', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|avatars/.*\.webp|examples/.*\.webp|examples/.*\.jpg|examples/.*\.png).*)'],
}; 