import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@edumart/shared';
import { AccountStatus } from '@edumart/shared';
import type { User as SupabaseUser } from '@supabase/supabase-js'

import { getDashboardPath } from './lib/auth';
import { isAuthPage, isProtectedPath } from './lib/rbac';
import { findAppUserForSupabaseUser } from './lib/supabase/auth-route';
import { applySupabaseCookies, createRequestClient } from './lib/supabase/middleware';

const PUBLIC_FILE = /\.(.*)$/;

function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  if (normalized === UserRole.ADMIN) {
    return UserRole.ADMIN;
  }

  if (normalized === UserRole.VENDOR) {
    return UserRole.VENDOR;
  }

  if (normalized === UserRole.CUSTOMER) {
    return UserRole.CUSTOMER;
  }

  // Accept common lowercase metadata values from Supabase user_metadata.
  if (normalized === 'CUSTOMER' || normalized === 'USER') {
    return UserRole.CUSTOMER;
  }

  return null;
}

function getRoleFromSupabaseUser(user: SupabaseUser | null) {
  if (!user) {
    return null
  }

  const roleFromAppMetadata = normalizeRole((user.app_metadata as Record<string, unknown> | undefined)?.role)
  if (roleFromAppMetadata) {
    return roleFromAppMetadata
  }

  const roleFromUserMetadata = normalizeRole((user.user_metadata as Record<string, unknown> | undefined)?.role)
  if (roleFromUserMetadata) {
    return roleFromUserMetadata
  }

  // Default to customer when authenticated but role metadata is missing.
  return UserRole.CUSTOMER
}

async function getDbRoleFromUser(user: SupabaseUser | null) {
  if (!user) {
    return {
      role: null,
      isActiveStatus: false,
      checked: false,
    }
  }

  try {
    const appUser = await findAppUserForSupabaseUser({
      id: user.id,
      email: user.email,
    })

    if (!appUser) {
      return {
        role: null,
        isActiveStatus: false,
        checked: false,
      }
    }
    const role = normalizeRole(appUser.role)
    const accountStatus = String(appUser.accountStatus ?? '').toUpperCase()

    return {
      role,
      isActiveStatus: accountStatus === AccountStatus.ACTIVE,
      checked: true,
    }
  } catch {
    return { role: null, isActiveStatus: false, checked: false }
  }
}

function isRoleAllowedOnPath(pathname: string, role: UserRole) {
  if (pathname.startsWith('/dashboard/admin')) {
    return role === UserRole.ADMIN
  }

  if (pathname.startsWith('/dashboard/vendor')) {
    return role === UserRole.VENDOR
  }

  if (pathname.startsWith('/dashboard/customer')) {
    return role === UserRole.CUSTOMER
  }

  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  let cookiesToSet: Array<{ name: string; value: string; options: any }> = []
  const { supabase } = createRequestClient(request, (nextCookies) => {
    cookiesToSet = nextCookies
  })

  const { data } = await supabase.auth.getUser()
  const supabaseResponse = applySupabaseCookies(
    NextResponse.next({ request }),
    cookiesToSet,
  )

  const requiresRoleContext = isProtectedPath(pathname) || isAuthPage(pathname)

  if (!requiresRoleContext) {
    return supabaseResponse
  }

  const metadataRole = getRoleFromSupabaseUser(data.user)
  const dbAuth = await getDbRoleFromUser(data.user)

  const dbRole = dbAuth.role

  const requestedPath = `${pathname}${request.nextUrl.search}`

  if ((metadataRole || dbRole) && !dbAuth.isActiveStatus) {
    if (isProtectedPath(pathname)) {
      const inactiveUrl = new URL('/account-inactive', request.url)
      inactiveUrl.searchParams.set('from', requestedPath)
      return NextResponse.redirect(inactiveUrl)
    }

    return supabaseResponse
  }

  // If metadata says authenticated but DB-backed identity cannot be resolved, force re-auth.
  if (metadataRole && !dbRole && dbAuth.checked) {
    return NextResponse.redirect(new URL('/logout', request.url))
  }

  if (metadataRole && dbRole && metadataRole !== dbRole) {
    return NextResponse.redirect(new URL('/logout', request.url))
  }

  const role = dbRole ?? metadataRole

  if (isAuthPage(pathname) && role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (!isProtectedPath(pathname)) {
    return supabaseResponse;
  }

  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  if (!isRoleAllowedOnPath(pathname, role)) {
    const unauthorizedUrl = new URL('/unauthorized', request.url)
    unauthorizedUrl.searchParams.set('from', requestedPath)
    return NextResponse.redirect(unauthorizedUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
