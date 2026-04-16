import { UserRole } from '@edumart/shared'
import { AccountStatus } from '@edumart/shared'
import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

import { createRequestClient } from './middleware'
import { isPrismaDatabaseError } from './auth-route'

export interface AuthenticatedAppUser {
  id: string
  role: UserRole
  vendorProfileId: string | null
}

export async function getAuthenticatedAppUser(request: NextRequest): Promise<AuthenticatedAppUser | null> {
  const { supabase } = createRequestClient(request)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  const email = data.user.email?.trim().toLowerCase() ?? null

  let appUser: {
    id: string
    role: UserRole
    accountStatus: AccountStatus
    isActive: boolean
    deletedAt: Date | null
    vendorProfile: { id: string } | null
  } | null = null

  try {
    appUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: data.user.id },
          ...(email ? [{ email }] : []),
        ],
      },
      include: { vendorProfile: true },
    }) as typeof appUser
  } catch (error) {
    if (!isPrismaDatabaseError(error)) {
      throw error
    }

    const metadata = data.user.user_metadata as Record<string, unknown> | undefined
    const appMetadata = data.user.app_metadata as Record<string, unknown> | undefined
    const rawRole = String(appMetadata?.role ?? metadata?.role ?? '').trim().toUpperCase()
    const role = rawRole === UserRole.ADMIN || rawRole === UserRole.VENDOR ? (rawRole as UserRole) : UserRole.CUSTOMER

    const rawStatus = String(appMetadata?.accountStatus ?? metadata?.accountStatus ?? '').trim().toUpperCase()
    const accountStatus =
      rawStatus === AccountStatus.SUSPENDED
        ? AccountStatus.SUSPENDED
        : rawStatus === AccountStatus.PENDING
          ? AccountStatus.PENDING
          : AccountStatus.ACTIVE

    appUser = {
      id: data.user.id,
      role,
      accountStatus,
      isActive: true,
      deletedAt: null,
      vendorProfile: null,
    }
  }

  if (!appUser || !appUser.isActive || appUser.deletedAt) {
    return null
  }

  if (appUser.accountStatus !== AccountStatus.ACTIVE) {
    return null
  }

  return {
    id: appUser.id,
    role: appUser.role as UserRole,
    vendorProfileId: appUser.vendorProfile?.id ?? null,
  }
}

export async function requireAuthenticatedAppUser(
  request: NextRequest,
  allowedRoles: UserRole[] = [UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN],
) {
  const user = await getAuthenticatedAppUser(request)
  if (!user) {
    return { user: null, status: 401 as const, message: 'Unauthorized' }
  }

  if (!allowedRoles.includes(user.role)) {
    return { user: null, status: 403 as const, message: 'Forbidden' }
  }

  return { user, status: 200 as const, message: '' }
}
