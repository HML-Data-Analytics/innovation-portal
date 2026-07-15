import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, isValidSession } from '@/lib/auth';

export const config = {
  matcher: ['/admin/:path*', '/api/apps/:path*', '/api/upload/:path*'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page and public read-only app listing stay open.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/apps') && request.method === 'GET') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValidSession(cookie, process.env.ADMIN_PASSWORD);

  if (!authed) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
