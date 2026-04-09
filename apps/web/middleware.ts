import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import { UserRole } from '@edumart/shared';

import { AUTH_COOKIE_NAMES, getDashboardPath } from './lib/auth';
import { isAuthPage, isProtectedPath } from './lib/rbac';

const PUBLIC_FILE = /\.(.*)$/;

async function verifyToken(token: string | undefined) {
  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    return {
      userId: String(payload.sub ?? ''),
      email: String(payload.email ?? ''),
      role: payload.role as UserRole,
      type: String(payload.type ?? ''),
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;
  const auth = await verifyToken(accessToken);

  if (isAuthPage(pathname) && auth) {
    return NextResponse.redirect(new URL(getDashboardPath(auth.role), request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!auth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/dashboard/customer') && auth.role !== UserRole.CUSTOMER && auth.role !== UserRole.VENDOR && auth.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/vendor') && auth.role !== UserRole.VENDOR && auth.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/admin') && auth.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
