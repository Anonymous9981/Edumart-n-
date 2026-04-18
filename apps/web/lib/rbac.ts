import { UserRole } from '@edumart/shared';
import { ROLE_DASHBOARD_PATHS } from '../constants/roles';
import { canAccessDashboardPath } from './authorization/policy'

export const DASHBOARD_PATHS = ROLE_DASHBOARD_PATHS;

export const PROTECTED_PREFIXES = ['/dashboard'];
export const AUTH_PAGES = ['/login', '/signup', '/forgot-password'];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  VENDOR: 2,
  ADMIN: 3,
};

export function hasMinimumRole(actual: UserRole, required: UserRole) {
  return ROLE_HIERARCHY[actual] >= ROLE_HIERARCHY[required];
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isAuthPage(pathname: string) {
  return AUTH_PAGES.includes(pathname);
}

function getPathname(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl, 'http://localhost').pathname
  } catch {
    return pathOrUrl.split('?')[0] ?? pathOrUrl
  }
}

export function isPathAllowedForRole(pathOrUrl: string, role: UserRole) {
  const pathname = getPathname(pathOrUrl)

  return canAccessDashboardPath(
    {
      id: 'anonymous',
      role,
      vendorProfileId: null,
    },
    pathname,
  )
}

export function resolvePostLoginPath(fromValue: string | null | undefined, role: UserRole) {
  if (!fromValue || !fromValue.startsWith('/') || fromValue.startsWith('//')) {
    return '/dashboard/profile'
  }

  const pathname = getPathname(fromValue)

  if (isAuthPage(pathname)) {
    return '/dashboard/profile'
  }

  if (isProtectedPath(pathname) && !isPathAllowedForRole(fromValue, role)) {
    return '/dashboard/profile'
  }

  return fromValue
}
