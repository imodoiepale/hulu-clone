// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');

  // List of protected paths
  const protectedPaths = ['/acc'];

  // Check if the requested path is protected
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/movies/:path*'],
};