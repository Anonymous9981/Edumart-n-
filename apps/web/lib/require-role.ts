import { UserRole } from '@edumart/shared'
import { AccountStatus } from '@edumart/shared'
import { redirect } from 'next/navigation'

import { prisma } from './prisma'
import { createClient } from './supabase/server'

export interface RequiredUser {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
}

export async function requireRole(allowedRoles: UserRole[], fromPath: string): Promise<RequiredUser> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect(`/login?from=${encodeURIComponent(fromPath)}`)
  }

  const supabaseUser = data.user
  const email = supabaseUser.email?.trim().toLowerCase() ?? null

  let appUser: {
    id: string
    email: string
    role: UserRole
    accountStatus: AccountStatus
    firstName: string | null
    lastName: string | null
    isActive: boolean
    deletedAt: Date | null
  } | null = null

  try {
    appUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: supabaseUser.id },
          ...(email ? [{ email }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        role: true,
        accountStatus: true,
        firstName: true,
        lastName: true,
        isActive: true,
        deletedAt: true,
      },
    }) as typeof appUser
  } catch {
    const metadata = supabaseUser.user_metadata as Record<string, unknown> | undefined
    const appMetadata = supabaseUser.app_metadata as Record<string, unknown> | undefined
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
      id: supabaseUser.id,
      email: email ?? '',
      role,
      accountStatus,
      firstName: String(metadata?.first_name ?? metadata?.given_name ?? '') || null,
      lastName: String(metadata?.last_name ?? metadata?.family_name ?? '') || null,
      isActive: true,
      deletedAt: null,
    }
  }

  if (!appUser || !appUser.isActive || appUser.deletedAt) {
    redirect(`/login?from=${encodeURIComponent(fromPath)}`)
  }

  if (appUser.accountStatus !== AccountStatus.ACTIVE) {
    redirect(`/account-inactive?from=${encodeURIComponent(fromPath)}`)
  }

  if (!allowedRoles.includes(appUser.role as UserRole)) {
    redirect('/unauthorized')
  }

  return {
    id: appUser.id,
    email: appUser.email,
    role: appUser.role as UserRole,
    firstName: appUser.firstName,
    lastName: appUser.lastName,
  }
}
