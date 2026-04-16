import { UserRole } from '@edumart/shared'

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  CUSTOMER: '/dashboard/customer',
  VENDOR: '/dashboard/vendor',
  ADMIN: '/dashboard/admin',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Customer',
  VENDOR: 'Vendor',
  ADMIN: 'Admin',
}

export function getDashboardPathForRole(role: UserRole) {
  return ROLE_DASHBOARD_PATHS[role]
}
