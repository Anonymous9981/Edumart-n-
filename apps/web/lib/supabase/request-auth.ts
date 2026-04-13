import { UserRole } from '@edumart/shared'
import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

import { createRequestClient } from './middleware'

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

  const appUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: data.user.id },
        ...(email ? [{ email }] : []),
      ],
    },
    include: { vendorProfile: true },
  })

  if (!appUser || !appUser.isActive || appUser.deletedAt) {
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
