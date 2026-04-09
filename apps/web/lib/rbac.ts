import { UserRole } from '@edumart/shared';

export const DASHBOARD_PATHS: Record<UserRole, string> = {
  CUSTOMER: '/dashboard/customer',
  VENDOR: '/dashboard/vendor',
  ADMIN: '/dashboard/admin',
};

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
