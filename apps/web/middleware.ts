import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@edumart/shared';

import { prisma } from './lib/prisma';
import { getDashboardPath } from './lib/auth';
import { isAuthPage, isProtectedPath } from './lib/rbac';
import { createRequestClient, updateSession } from './lib/supabase/middleware';

const PUBLIC_FILE = /\.(.*)$/;

async function getAppRoleFromRequest(request: NextRequest) {
  const { supabase } = createRequestClient(request)
  const { data } = await supabase.auth.getUser()
  const userId = data.user?.id
  const email = data.user?.email?.trim().toLowerCase() ?? null

  if (!userId && !email) {
    return null
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(userId ? [{ id: userId }] : []),
        ...(email ? [{ email }] : []),
      ],
    },
    select: { role: true },
  })

  return user?.role as UserRole | undefined ?? null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const supabaseResponse = await updateSession(request);
  const role = await getAppRoleFromRequest(request);

  if (isAuthPage(pathname) && role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (!isProtectedPath(pathname)) {
    return supabaseResponse;
  }

  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/dashboard/customer') && role !== UserRole.CUSTOMER && role !== UserRole.VENDOR && role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/vendor') && role !== UserRole.VENDOR && role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/admin') && role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
