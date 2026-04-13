import { createServerClient } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

import { UserRole } from '@edumart/shared'

import { prisma } from '@/lib/prisma'

import { getSupabasePublishableKey, getSupabaseUrl } from './env'

type CookieToSet = {
  name: string
  value: string
  options: any
}

export function createRouteClient(request: NextRequest) {
  const cookiesToSet: CookieToSet[] = []

  const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(nextCookies) {
        cookiesToSet.splice(0, cookiesToSet.length, ...nextCookies)
      },
    },
  })

  function applyCookies(response: NextResponse) {
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  }

  return {
    supabase,
    applyCookies,
  }
}

export async function findAppUserForSupabaseUser(input: { id?: string | null; email?: string | null }) {
  const email = input.email?.trim().toLowerCase() ?? null

  if (input.id) {
    const byId = await prisma.user.findUnique({
      where: { id: input.id },
      include: { vendorProfile: true },
    })

    if (byId) {
      return byId
    }
  }

  if (email) {
    return prisma.user.findUnique({
      where: { email },
      include: { vendorProfile: true },
    })
  }

  return null
}

export async function syncAppUserFromSupabaseUser(input: {
  id: string
  email: string
  role?: UserRole
  firstName?: string | null
  lastName?: string | null
  avatar?: string | null
  phone?: string | null
  storeName?: string | null
  isEmailVerified?: boolean
  ipAddress?: string | null
}) {
  const normalizedEmail = input.email.trim().toLowerCase()
  const existingById = await prisma.user.findUnique({
    where: { id: input.id },
    include: { vendorProfile: true },
  })
  const existingByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { vendorProfile: true },
  })
  const existingUser = existingById ?? existingByEmail

  const role = input.role ?? (existingUser?.role as UserRole | undefined) ?? UserRole.CUSTOMER
  const isVendor = role === UserRole.VENDOR
  const isEmailVerified = input.isEmailVerified ?? existingUser?.isEmailVerified ?? true

  const userId = existingUser?.id ?? input.id

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: normalizedEmail,
      passwordHash: null,
      role,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      avatar: input.avatar ?? null,
      phone: input.phone ?? null,
      isActive: true,
      isEmailVerified,
      lastLoginAt: new Date(),
      lastLoginIP: input.ipAddress ?? undefined,
    },
    update: {
      email: normalizedEmail,
      role,
      firstName: input.firstName ?? existingUser?.firstName ?? null,
      lastName: input.lastName ?? existingUser?.lastName ?? null,
      avatar: input.avatar ?? existingUser?.avatar ?? null,
      phone: input.phone ?? existingUser?.phone ?? null,
      isActive: true,
      isEmailVerified,
      lastLoginAt: new Date(),
      lastLoginIP: input.ipAddress ?? undefined,
    },
  })

  if (isVendor) {
    await prisma.vendorProfile.upsert({
      where: { userId },
      create: {
        userId,
        storeName: input.storeName?.trim() || existingUser?.vendorProfile?.storeName || `Vendor-${userId.slice(0, 8)}`,
        description: existingUser?.vendorProfile?.description ?? null,
        logo: existingUser?.vendorProfile?.logo ?? null,
        banner: existingUser?.vendorProfile?.banner ?? null,
        verificationStatus: 'PENDING_VERIFICATION',
        rating: existingUser?.vendorProfile?.rating ?? 0,
        reviewCount: existingUser?.vendorProfile?.reviewCount ?? 0,
        bankAccountName: existingUser?.vendorProfile?.bankAccountName ?? null,
        bankAccountNumber: existingUser?.vendorProfile?.bankAccountNumber ?? null,
        bankCode: existingUser?.vendorProfile?.bankCode ?? null,
        taxId: existingUser?.vendorProfile?.taxId ?? null,
        businessLicense: existingUser?.vendorProfile?.businessLicense ?? null,
        rejectionReason: existingUser?.vendorProfile?.rejectionReason ?? null,
      },
      update: {
        storeName: input.storeName?.trim() || existingUser?.vendorProfile?.storeName || `Vendor-${userId.slice(0, 8)}`,
      },
    })
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: { vendorProfile: true },
  })
}