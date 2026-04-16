import { profileUpdateSchema } from '@edumart/validation'
import { UserRole } from '@edumart/shared'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/response'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      phone: true,
      bio: true,
      avatar: true,
      vendorProfile: {
        select: {
          id: true,
          storeName: true,
          description: true,
          logo: true,
          banner: true,
          bankAccountName: true,
          bankAccountNumber: true,
          bankCode: true,
          taxId: true,
          verificationStatus: true,
        },
      },
    },
  })

  if (!user) {
    return errorResponse('Profile not found', 404)
  }

  return successResponse({ user })
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const body = await request.json()
    const parsed = profileUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse('Invalid profile payload', 400, 'VALIDATION_ERROR', {
        errors: parsed.error.flatten(),
      })
    }

    const input = parsed.data

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: auth.user!.id },
        data: {
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
          phone: input.phone ?? undefined,
          bio: input.bio ?? undefined,
          avatar: input.avatar ?? undefined,
        },
      })

      if (auth.user!.role === UserRole.VENDOR && auth.user!.vendorProfileId) {
        await tx.vendorProfile.update({
          where: { id: auth.user!.vendorProfileId },
          data: {
            storeName: input.storeName ?? undefined,
            description: input.description ?? undefined,
            logo: input.logo ?? undefined,
            banner: input.banner ?? undefined,
            bankAccountName: input.bankAccountName ?? undefined,
            bankAccountNumber: input.bankAccountNumber ?? undefined,
            bankCode: input.bankCode ?? undefined,
            taxId: input.taxId ?? undefined,
          },
        })
      }

      return tx.user.findUnique({
        where: { id: auth.user!.id },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          bio: true,
          avatar: true,
          vendorProfile: {
            select: {
              id: true,
              storeName: true,
              description: true,
              logo: true,
              banner: true,
              bankAccountName: true,
              bankAccountNumber: true,
              bankCode: true,
              taxId: true,
              verificationStatus: true,
            },
          },
        },
      })
    })

    return successResponse({ user: updated })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update profile', 500)
  }
}
