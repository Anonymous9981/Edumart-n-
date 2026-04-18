import { UserRole } from '@edumart/shared'

export type PermissionAction =
  | 'dashboard.view'
  | 'product.list'
  | 'product.read'
  | 'product.create'
  | 'product.update'
  | 'product.delete'

export interface PermissionSubject {
  id: string
  role: UserRole
  vendorProfileId: string | null
  isBlocked?: boolean
  organizationId?: string | null
}

export type PermissionResource =
  | {
      type: 'dashboard'
      pathname: string
    }
  | {
      type: 'product'
      vendorId: string | null
      status?: string | null
      isDeleted?: boolean
    }

export interface PermissionEnvironment {
  now?: Date
}

export interface PermissionInput {
  subject: PermissionSubject
  action: PermissionAction
  resource?: PermissionResource
  environment?: PermissionEnvironment
}

function normalizePathname(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl, 'http://localhost').pathname
  } catch {
    return pathOrUrl.split('?')[0] ?? pathOrUrl
  }
}

function canViewDashboard(subject: PermissionSubject, pathname: string) {
  if (!pathname.startsWith('/dashboard')) {
    return true
  }

  if (pathname.startsWith('/dashboard/admin')) {
    return subject.role === UserRole.ADMIN
  }

  if (pathname.startsWith('/dashboard/vendor')) {
    return subject.role === UserRole.VENDOR
  }

  if (pathname.startsWith('/dashboard/customer')) {
    return subject.role === UserRole.CUSTOMER
  }

  return true
}

function canAccessProduct(subject: PermissionSubject, resource: Extract<PermissionResource, { type: 'product' }>) {
  if (subject.role === UserRole.ADMIN) {
    return true
  }

  if (subject.role !== UserRole.VENDOR) {
    return false
  }

  if (!subject.vendorProfileId) {
    return false
  }

  return resource.vendorId === subject.vendorProfileId
}

export function hasPermission(input: PermissionInput) {
  const { subject, action, resource } = input

  if (subject.isBlocked) {
    return false
  }

  switch (action) {
    case 'dashboard.view': {
      if (!resource || resource.type !== 'dashboard') {
        return false
      }
      return canViewDashboard(subject, normalizePathname(resource.pathname))
    }
    case 'product.list':
    case 'product.read':
    case 'product.create':
    case 'product.update':
    case 'product.delete': {
      if (!resource || resource.type !== 'product') {
        return false
      }

      if (resource.isDeleted && action !== 'product.read') {
        return false
      }

      return canAccessProduct(subject, resource)
    }
    default:
      return false
  }
}

export function canAccessDashboardPath(subject: PermissionSubject, pathOrUrl: string) {
  return hasPermission({
    subject,
    action: 'dashboard.view',
    resource: {
      type: 'dashboard',
      pathname: pathOrUrl,
    },
  })
}

export function toPermissionSubject(user: {
  id: string
  role: UserRole
  vendorProfileId?: string | null
  isBlocked?: boolean
  organizationId?: string | null
}): PermissionSubject {
  return {
    id: user.id,
    role: user.role,
    vendorProfileId: user.vendorProfileId ?? null,
    isBlocked: user.isBlocked,
    organizationId: user.organizationId ?? null,
  }
}
